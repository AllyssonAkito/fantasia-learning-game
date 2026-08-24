import { describe, expect, it } from 'vitest';
import { EquipmentRepository } from './equipment';
import { InventoryRepository } from './inventory';
import { initialItemCatalog } from './item-catalog';
describe('catálogo e equipamento', () => {
  it('não contém compra, preço ou raridade manipulativa', () => {
    expect(initialItemCatalog).toHaveLength(3);
    for (const item of initialItemCatalog) {
      expect(item.unlock.kind).toBe('activity-reward');
      expect(item).not.toHaveProperty('price');
      expect(item).not.toHaveProperty('rarity');
    }
  });
  it('persiste item equipado apenas no perfil que o obteve', () => {
    const inventory = new InventoryRepository();
    const equipment = new EquipmentRepository();
    inventory.obtain('profile-melina', {
      itemId: 'item.bow.pink',
      obtainedAt: '2026-08-24T12:00:00.000Z',
    });
    equipment.equip('profile-melina', 'item.bow.pink', inventory);
    expect(equipment.get('profile-melina').equipped.head).toBe('item.bow.pink');
    expect(equipment.get('profile-other').equipped).toEqual({});
  });
  it('impede equipar item ainda não obtido', () => {
    expect(() =>
      new EquipmentRepository().equip(
        'profile-melina',
        'item.bow.pink',
        new InventoryRepository(),
      ),
    ).toThrow('Complete a brincadeira');
  });
});
