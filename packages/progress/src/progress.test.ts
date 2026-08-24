import { describe, expect, it } from 'vitest';
import { createEmptyProgress, progressSnapshotSchema } from './progress';
const profileId = 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071';
const timestamp = '2026-08-24T12:00:00.000Z';
describe('progressSnapshotSchema', () => {
  it('define estado separado por atividade, nível, skill e trilha', () => {
    const snapshot = progressSnapshotSchema.parse({
      ...createEmptyProgress(profileId, timestamp),
      activities: {
        'activity.logic.first.001': {
          state: 'completed',
          completedAt: timestamp,
          attempts: 2,
          bestStars: 3,
        },
      },
      levels: { 'level.logic.first.01': { state: 'available' } },
      skills: { 'skill.logic.first': { state: 'inProgress' } },
      trails: { 'trail.logic.first': { state: 'inProgress' } },
    });
    expect(snapshot.activities['activity.logic.first.001']?.state).toBe(
      'completed',
    );
    expect(snapshot.levels['level.logic.first.01']?.state).toBe('available');
  });
  it('cria estado vazio válido e isolado por perfil', () => {
    expect(createEmptyProgress(profileId, timestamp)).toMatchObject({
      profileId,
      activities: {},
      levels: {},
      skills: {},
      trails: {},
    });
  });
  it('recusa conclusão sem consistência temporal', () => {
    const candidate = {
      ...createEmptyProgress(profileId, timestamp),
      levels: {
        'level.logic.first.01': { state: 'available', completedAt: timestamp },
      },
    };
    expect(progressSnapshotSchema.safeParse(candidate).success).toBe(false);
  });
});
