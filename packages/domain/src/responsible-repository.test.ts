import { describe, expect, it } from 'vitest';

import { InMemoryResponsibleRepository } from './responsible-repository';
import type { Responsible } from './responsible';

const account = {
  schemaVersion: 1,
  id: 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec',
  displayName: 'Responsável',
  createdAt: '2026-08-24T12:00:00.000Z',
  updatedAt: '2026-08-24T12:00:00.000Z',
} as const;

describe('InMemoryResponsibleRepository', () => {
  it('salva e recupera uma cópia validada do responsável', async () => {
    const repository = new InMemoryResponsibleRepository();

    const saved = await repository.save(account);
    const restored = await repository.findById(account.id);

    expect(saved).toEqual(account);
    expect(restored).toEqual(account);
    expect(restored).not.toBe(saved);
  });

  it('retorna null quando a identidade não existe', async () => {
    const repository = new InMemoryResponsibleRepository();

    await expect(repository.findById(account.id)).resolves.toBeNull();
  });

  it('remove somente o registro solicitado', async () => {
    const repository = new InMemoryResponsibleRepository([account]);

    await expect(repository.remove(account.id)).resolves.toBe(true);
    await expect(repository.remove(account.id)).resolves.toBe(false);
    await expect(repository.findById(account.id)).resolves.toBeNull();
  });

  it('recusa persistir dados fora do schema aprovado', async () => {
    const repository = new InMemoryResponsibleRepository();

    await expect(
      repository.save({
        ...account,
        email: 'adulto@example.com',
      } as unknown as Responsible),
    ).rejects.toThrow();
    await expect(repository.findById(account.id)).resolves.toBeNull();
  });
});
