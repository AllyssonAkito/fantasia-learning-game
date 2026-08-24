import { describe, expect, it } from 'vitest';

import {
  ChildProfileService,
  InMemoryChildProfileRepository,
} from './child-profile-service';

const responsibleId = 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec';
const profileId = 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071';
const timestamp = '2026-08-24T12:00:00.000Z';

describe('ChildProfileService', () => {
  const input = {
    displayName: 'Melina',
    ageBand: '4-5',
    avatarId: 'avatar.bunny',
    preferences: {
      narrationEnabled: true,
      soundEffectsEnabled: true,
      reducedMotion: false,
    },
  } as const;

  it('permite ao responsável criar um perfil validado', async () => {
    const repository = new InMemoryChildProfileRepository();
    const service = new ChildProfileService(
      repository,
      () => profileId,
      () => timestamp,
    );

    const profile = await service.create(responsibleId, input);

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

  it('edita somente os campos permitidos e persiste a alteração', async () => {
    let currentTime = timestamp;
    const repository = new InMemoryChildProfileRepository();
    const service = new ChildProfileService(
      repository,
      () => profileId,
      () => currentTime,
    );
    const created = await service.create(responsibleId, input);
    currentTime = '2026-08-24T13:00:00.000Z';

    const updated = await service.update(responsibleId, profileId, {
      avatarId: 'avatar.yellow-friend',
      preferences: { ...created.preferences, reducedMotion: true },
    });

    expect(updated).toMatchObject({
      id: profileId,
      responsibleId,
      avatarId: 'avatar.yellow-friend',
      updatedAt: currentTime,
    });
    await expect(repository.findById(profileId)).resolves.toEqual(updated);
  });

  it('arquiva com confirmação adulta e preserva o registro', async () => {
    let currentTime = timestamp;
    const repository = new InMemoryChildProfileRepository();
    const service = new ChildProfileService(
      repository,
      () => profileId,
      () => currentTime,
    );
    await service.create(responsibleId, input);

    await expect(
      service.archive(responsibleId, profileId, false),
    ).rejects.toThrow('confirmação adulta');
    currentTime = '2026-08-24T14:00:00.000Z';
    const archived = await service.archive(responsibleId, profileId, true);

    expect(archived.archivedAt).toBe(currentTime);
    await expect(repository.listByResponsible(responsibleId)).resolves.toEqual([
      archived,
    ]);
  });
});
