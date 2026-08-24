import { describe, expect, it } from 'vitest';

import { childProfileSchema } from './child-profile';

const validProfile = {
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

describe('childProfileSchema', () => {
  it('aceita faixa etária, avatar e preferências mínimas', () => {
    expect(childProfileSchema.parse(validProfile)).toEqual(validProfile);
  });

  it.each([
    { ...validProfile, birthDate: '2022-01-01' },
    { ...validProfile, ageBand: '4' },
    { ...validProfile, avatarId: 'https://example.com/photo.jpg' },
    { ...validProfile, displayName: '' },
  ])('recusa dado desnecessário ou valor inválido: %o', (candidate) => {
    expect(childProfileSchema.safeParse(candidate).success).toBe(false);
  });
});
