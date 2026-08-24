import { describe, expect, it } from 'vitest';
import {
  completeActivity,
  InMemoryProgressRepository,
} from './progress-repository';

const profileId = 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071';

describe('completeActivity', () => {
  it('persiste conclusão uma única vez e preserva a melhor estrela', async () => {
    const repository = new InMemoryProgressRepository();
    const input = {
      profileId,
      activityId: 'activity.logic.first.001',
      attempts: 2,
      stars: 2,
      completedAt: '2026-08-24T12:00:00.000Z',
    };
    const first = await completeActivity(repository, input);
    const repeated = await completeActivity(repository, {
      ...input,
      attempts: 4,
      stars: 1,
      completedAt: '2026-08-25T12:00:00.000Z',
    });
    expect(repeated).toEqual(first);
  });

  it('retorna cópias para impedir mutação externa', async () => {
    const repository = new InMemoryProgressRepository();
    await completeActivity(repository, {
      profileId,
      activityId: 'activity.logic.first.001',
      attempts: 1,
      stars: 3,
      completedAt: '2026-08-24T12:00:00.000Z',
    });
    const first = await repository.get(profileId);
    const second = await repository.get(profileId);
    expect(first).not.toBe(second);
  });
});
