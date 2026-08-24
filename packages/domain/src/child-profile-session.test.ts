import { describe, expect, it } from 'vitest';

import { InMemoryChildProfileRepository } from './child-profile-service';
import { ChildProfileSession } from './child-profile-session';

const profile = {
  schemaVersion: 1,
  id: 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071',
  responsibleId: 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec',
  displayName: 'Melina',
  ageBand: '4-5',
  avatarId: 'avatar.bunny',
  preferences: {
    narrationEnabled: true,
    soundEffectsEnabled: true,
    reducedMotion: false,
  },
  createdAt: '2026-08-24T12:00:00.000Z',
  updatedAt: '2026-08-24T12:00:00.000Z',
} as const;

describe('ChildProfileSession', () => {
  it('seleciona o perfil ativo correto', async () => {
    const repository = new InMemoryChildProfileRepository();
    await repository.save(profile);
    const session = new ChildProfileSession(repository);

    await expect(
      session.select(profile.responsibleId, profile.id),
    ).resolves.toEqual({
      status: 'active',
      profile,
    });
  });

  it('recusa perfil de outro responsável ou arquivado', async () => {
    const repository = new InMemoryChildProfileRepository();
    await repository.save({
      ...profile,
      archivedAt: '2026-08-24T13:00:00.000Z',
    });
    const session = new ChildProfileSession(repository);

    await expect(
      session.select(profile.responsibleId, profile.id),
    ).resolves.toEqual({
      status: 'error',
      message: 'Este perfil não está disponível.',
    });
  });
});
