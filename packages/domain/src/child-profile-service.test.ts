import { describe, expect, it } from 'vitest';

import {
  ChildProfileService,
  InMemoryChildProfileRepository,
} from './child-profile-service';

const responsibleId = 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec';
const profileId = 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071';
const timestamp = '2026-08-24T12:00:00.000Z';

describe('ChildProfileService', () => {
  it('permite ao responsável criar um perfil validado', async () => {
    const repository = new InMemoryChildProfileRepository();
    const service = new ChildProfileService(
      repository,
      () => profileId,
      () => timestamp,
    );

    const profile = await service.create(responsibleId, {
      displayName: 'Melina',
      ageBand: '4-5',
      avatarId: 'avatar.bunny',
      preferences: {
        narrationEnabled: true,
        soundEffectsEnabled: true,
        reducedMotion: false,
      },
    });

    expect(profile.id).toBe(profileId);
    await expect(repository.findById(profileId)).resolves.toEqual(profile);
  });

  it('não persiste um perfil inválido', async () => {
    const repository = new InMemoryChildProfileRepository();
    const service = new ChildProfileService(
      repository,
      () => profileId,
      () => timestamp,
    );

    await expect(
      service.create(responsibleId, {
        displayName: '',
        ageBand: '4-5',
        avatarId: 'avatar.bunny',
        preferences: {
          narrationEnabled: true,
          soundEffectsEnabled: true,
          reducedMotion: false,
        },
      }),
    ).rejects.toThrow();
    await expect(repository.findById(profileId)).resolves.toBeNull();
  });
});
