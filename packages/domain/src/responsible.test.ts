import { describe, expect, it } from 'vitest';

import { responsibleSchema } from './responsible';

const validResponsible = {
  schemaVersion: 1,
  id: 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec',
  displayName: 'Responsável',
  createdAt: '2026-08-24T12:00:00.000Z',
  updatedAt: '2026-08-24T12:00:00.000Z',
} as const;

describe('responsibleSchema', () => {
  it('aceita somente os dados mínimos aprovados', () => {
    expect(responsibleSchema.parse(validResponsible)).toEqual(validResponsible);
  });

  it.each([
    { ...validResponsible, email: 'adulto@example.com' },
    { ...validResponsible, displayName: '' },
    { ...validResponsible, id: 'melina' },
    {
      ...validResponsible,
      updatedAt: '2026-08-23T12:00:00.000Z',
    },
  ])('recusa campo ou valor fora do contrato: %o', (candidate) => {
    expect(responsibleSchema.safeParse(candidate).success).toBe(false);
  });
});
