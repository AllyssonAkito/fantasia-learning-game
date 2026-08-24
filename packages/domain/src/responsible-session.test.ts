import { describe, expect, it } from 'vitest';

import { InMemoryResponsibleRepository } from './responsible-repository';
import { ResponsibleSession } from './responsible-session';

const account = {
  schemaVersion: 1,
  id: 'responsible_8a643a89-1bb1-4f21-a31d-9b84815cc5ec',
  displayName: 'Responsável',
  createdAt: '2026-08-24T12:00:00.000Z',
  updatedAt: '2026-08-24T12:00:00.000Z',
} as const;

describe('ResponsibleSession', () => {
  it('entra e persiste uma identidade válida', async () => {
    const repository = new InMemoryResponsibleRepository();
    const session = new ResponsibleSession(repository);

    await expect(session.enter(account)).resolves.toEqual({
      status: 'authenticated',
      responsible: account,
    });
    await expect(repository.findById(account.id)).resolves.toEqual(account);
  });

  it('restaura a identidade persistida', async () => {
    const session = new ResponsibleSession(
      new InMemoryResponsibleRepository([account]),
    );

    await expect(session.restore(account.id)).resolves.toEqual({
      status: 'authenticated',
      responsible: account,
    });
  });

  it('retorna ao estado anônimo quando não há registro', async () => {
    const session = new ResponsibleSession(new InMemoryResponsibleRepository());

    await expect(session.restore(account.id)).resolves.toEqual({
      status: 'anonymous',
    });
  });

  it('encerra a sessão sem excluir o registro', async () => {
    const repository = new InMemoryResponsibleRepository([account]);
    const session = new ResponsibleSession(repository);
    await session.restore(account.id);

    expect(session.signOut()).toEqual({ status: 'signedOut' });
    await expect(repository.findById(account.id)).resolves.toEqual(account);
  });
});
