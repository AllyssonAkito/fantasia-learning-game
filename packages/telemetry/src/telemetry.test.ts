import { describe, expect, it } from 'vitest';
import {
  InMemoryTelemetryAdapter,
  LocalTelemetryAdapter,
  type KeyValueStorage,
} from './adapters';
import { parseTelemetryEvent } from './events';
import { aggregateMvpMetrics } from './metrics';
import { applyRetention, deleteProfileTelemetry } from './retention';
import { SessionTelemetry } from './session-telemetry';

const activity = {
  activityId: 'activity.logic.patterns.001',
  activityVersion: 1,
  engine: 'sequence' as const,
  difficulty: 2,
};

function telemetry(
  adapter = new InMemoryTelemetryAdapter(),
  date = '2026-08-24T12:00:00.000Z',
) {
  return {
    adapter,
    session: new SessionTelemetry(adapter, {
      sessionId: 'session_123456',
      childProfileId: 'profile_abcdef',
      now: () => new Date(date),
    }),
  };
}

describe('telemetria privada do MVP', () => {
  it('emite início, conclusão e abandono apenas uma vez', () => {
    const { adapter, session } = telemetry();
    session.sessionStarted();
    session.sessionStarted();
    session.activityStarted(activity);
    session.activityStarted(activity);
    session.activityCompleted({ ...activity, elapsedMs: 4000 });
    session.activityCompleted({ ...activity, elapsedMs: 4000 });
    expect(adapter.list().map(({ event }) => event)).toEqual([
      'session_started',
      'activity_started',
      'activity_completed',
    ]);
  });

  it('registra respostas e dicas com schema versionado', () => {
    const { adapter, session } = telemetry();
    session.answer({
      ...activity,
      attempt: 1,
      result: 'incorrect',
      elapsedMs: 900,
    });
    session.hint({ ...activity, hintLevel: 2 });
    expect(adapter.list()).toHaveLength(2);
    expect(adapter.list()[0]).toMatchObject({ eventVersion: 1, attempt: 1 });
  });

  it('rejeita PII, texto livre e campos desconhecidos', () => {
    expect(() =>
      parseTelemetryEvent({
        event: 'session_started',
        eventVersion: 1,
        occurredAt: '2026-08-24T12:00:00.000Z',
        sessionId: 'session_123456',
        childProfileId: 'profile_abcdef',
        childName: 'Melina',
      }),
    ).toThrow();
    expect(() =>
      parseTelemetryEvent({
        event: 'runtime_error',
        eventVersion: 1,
        occurredAt: '2026-08-24T12:00:00.000Z',
        sessionId: 'session_123456',
        childProfileId: 'profile_abcdef',
        technicalCode: 'raw-stack-trace',
      }),
    ).toThrow();
  });

  it('persiste localmente sem backend e recupera falha de storage', () => {
    const values = new Map<string, string>();
    const storage: KeyValueStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => void values.set(key, value),
      removeItem: (key) => void values.delete(key),
    };
    const first = new LocalTelemetryAdapter(storage);
    telemetry(first).session.sessionStarted();
    expect(new LocalTelemetryAdapter(storage).list()).toHaveLength(1);
  });

  it('agrega métricas reproduzíveis e descritivas', () => {
    const { adapter, session } = telemetry();
    session.sessionStarted();
    session.activityStarted(activity);
    session.answer({
      ...activity,
      attempt: 1,
      result: 'incorrect',
      elapsedMs: 1000,
    });
    session.answer({
      ...activity,
      attempt: 2,
      result: 'correct',
      elapsedMs: 3000,
    });
    session.hint({ ...activity, hintLevel: 1 });
    session.activityCompleted({ ...activity, elapsedMs: 3500 });
    const metrics = aggregateMvpMetrics(adapter.list());
    expect(metrics).toMatchObject({
      sessions: 1,
      completionRate: 1,
      activitiesCompleted: 1,
      medianActivityMs: 3500,
      averageAttemptsToComplete: 2,
    });
    expect(metrics.areas[0]).toMatchObject({
      area: 'logic',
      completed: 1,
      hints: 1,
    });
  });

  it('aplica retenção e exclusão por perfil', () => {
    const adapter = new InMemoryTelemetryAdapter();
    telemetry(adapter, '2026-07-01T12:00:00.000Z').session.sessionStarted();
    telemetry(adapter, '2026-08-20T12:00:00.000Z').session.sessionStarted();
    expect(applyRetention(adapter, new Date('2026-08-24T12:00:00.000Z'))).toBe(
      1,
    );
    expect(deleteProfileTelemetry(adapter, 'profile_abcdef')).toBe(1);
    expect(adapter.list()).toEqual([]);
  });
});
