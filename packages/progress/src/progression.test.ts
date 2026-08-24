import { describe, expect, it } from 'vitest';
import { AttemptHistory } from './attempt-history';
import { createEmptyProgress } from './progress';
import { applyUnlockRules } from './unlock-rules';

const profileId = 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071';
const occurredAt = '2026-08-24T12:00:00.000Z';

describe('progressão configurável', () => {
  it('desbloqueia o próximo nível após os requisitos', () => {
    const snapshot = {
      ...createEmptyProgress(profileId, occurredAt),
      activities: {
        'activity.letters.a.001': {
          state: 'completed' as const,
          completedAt: occurredAt,
          attempts: 1,
          bestStars: 3,
        },
      },
      levels: { 'level.letters.02': { state: 'locked' as const } },
    };
    expect(
      applyUnlockRules(snapshot, [
        {
          targetLevelId: 'level.letters.02',
          requiredActivityIds: ['activity.letters.a.001'],
        },
      ]).levels['level.letters.02']?.state,
    ).toBe('available');
  });

  it('mantém bloqueado quando falta requisito', () => {
    const snapshot = createEmptyProgress(profileId, occurredAt);
    expect(
      applyUnlockRules(snapshot, [
        {
          targetLevelId: 'level.letters.02',
          requiredActivityIds: ['activity.letters.a.001'],
        },
      ]).levels['level.letters.02'],
    ).toBeUndefined();
  });
});

describe('histórico de tentativas', () => {
  it('associa tempo, tentativas, dicas e resultado à sessão sem duplicar', () => {
    const history = new AttemptHistory();
    const record = {
      sessionId: 'session-1',
      profileId,
      activityId: 'activity.letters.a.001',
      elapsedMs: 4200,
      attempts: 2,
      hintsUsed: 1,
      result: 'completed' as const,
      occurredAt,
    };
    history.add(record);
    history.add(record);
    expect(history.forProfile(profileId)).toEqual([record]);
  });
});
