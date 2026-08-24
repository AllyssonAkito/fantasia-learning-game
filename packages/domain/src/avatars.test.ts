import { describe, expect, it } from 'vitest';

import { avatarCatalog, getAvatar } from './avatars';

describe('avatarCatalog', () => {
  it('oferece os cinco personagens locais sem dados remotos', () => {
    expect(avatarCatalog).toHaveLength(5);
    expect(avatarCatalog.map(({ id }) => id)).toEqual([
      'avatar.dog',
      'avatar.bunny',
      'avatar.yellow-friend',
      'avatar.pink-octopus',
      'avatar.blue-octopus',
    ]);
    expect(getAvatar('avatar.bunny')?.label).toBe('Coelhinho');
    expect(getAvatar('avatar.unknown')).toBeNull();
  });
});
