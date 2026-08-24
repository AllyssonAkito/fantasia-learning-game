import type { TelemetryAdapter } from './adapters';
import {
  parseTelemetryEvent,
  type TelemetryEvent,
  type TelemetryEventName,
} from './events';

export interface SessionTelemetryContext {
  sessionId: string;
  childProfileId: string;
  now?: () => Date;
}

export class SessionTelemetry {
  private readonly once = new Set<string>();
  private readonly now: () => Date;

  constructor(
    private readonly adapter: TelemetryAdapter,
    private readonly context: SessionTelemetryContext,
  ) {
    this.now = context.now ?? (() => new Date());
  }

  emit(
    event: TelemetryEventName,
    data: Partial<
      Omit<
        TelemetryEvent,
        'event' | 'eventVersion' | 'occurredAt' | 'sessionId' | 'childProfileId'
      >
    > = {},
  ) {
    const parsed = parseTelemetryEvent({
      event,
      eventVersion: 1,
      occurredAt: this.now().toISOString(),
      sessionId: this.context.sessionId,
      childProfileId: this.context.childProfileId,
      ...data,
    });
    this.adapter.append(parsed);
    return parsed;
  }

  emitOnce(
    key: string,
    event: TelemetryEventName,
    data: Parameters<SessionTelemetry['emit']>[1] = {},
  ) {
    if (this.once.has(key)) return null;
    this.once.add(key);
    return this.emit(event, data);
  }

  sessionStarted() {
    return this.emitOnce('session', 'session_started');
  }
  activityStarted(data: ActivityEventData) {
    return this.emitOnce(
      `started:${data.activityId}`,
      'activity_started',
      data,
    );
  }
  activityCompleted(data: ActivityEventData & { elapsedMs: number }) {
    return this.emitOnce(
      `completed:${data.activityId}`,
      'activity_completed',
      data,
    );
  }
  activityAbandoned(data: ActivityEventData & { elapsedMs: number }) {
    return this.emitOnce(
      `abandoned:${data.activityId}`,
      'activity_abandoned',
      data,
    );
  }
  answer(
    data: ActivityEventData & {
      attempt: number;
      result: 'correct' | 'incorrect';
      elapsedMs: number;
    },
  ) {
    return this.emit('answer_submitted', data);
  }
  hint(data: ActivityEventData & { hintLevel: 1 | 2 | 3 }) {
    return this.emit('hint_shown', data);
  }
}

export interface ActivityEventData {
  activityId: string;
  activityVersion: number;
  engine: TelemetryEvent['engine'];
  difficulty: number;
}
