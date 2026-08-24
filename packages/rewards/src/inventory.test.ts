import { describe, expect, it } from 'vitest';
import { InventoryRepository } from './inventory';

describe('InventoryRepository', () => {
  it('mantém itens obtidos isolados e visíveis por perfil', () => {
    const repository = new InventoryRepository();
    repository.obtain('profile-melina', {
      itemId: 'item.bow.pink',
      obtainedAt: '2026-08-24T12:00:00.000Z',
    });
    repository.obtain('profile-melina', {
      itemId: 'item.bow.pink',
      obtainedAt: '2026-08-25T12:00:00.000Z',
    });
    expect(repository.get('profile-melina').items).toEqual([
      {
        itemId: 'item.bow.pink',
        obtainedAt: '2026-08-24T12:00:00.000Z',
      },
    ]);
    expect(repository.get('profile-other').items).toEqual([]);
  });
});
