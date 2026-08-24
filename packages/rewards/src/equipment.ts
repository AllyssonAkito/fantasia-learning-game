import type { InventoryRepository } from './inventory';
import { findCatalogItem, type EquipmentSlot } from './item-catalog';
export interface ProfileEquipment {
  profileId: string;
  equipped: Partial<Record<EquipmentSlot, string>>;
}
export class EquipmentRepository {
  readonly #records = new Map<string, ProfileEquipment>();
  equip(
    profileId: string,
    itemId: string,
    inventory: InventoryRepository,
  ): ProfileEquipment {
    const item = findCatalogItem(itemId);
    if (!item) throw new Error('Este item não está disponível.');
    if (
      !inventory.get(profileId).items.some((owned) => owned.itemId === itemId)
    )
      throw new Error('Complete a brincadeira para ganhar este item.');
    const current = this.#records.get(profileId) ?? { profileId, equipped: {} };
    current.equipped[item.slot] = item.id;
    this.#records.set(profileId, current);
    return this.get(profileId);
  }
  get(profileId: string): ProfileEquipment {
    const record = this.#records.get(profileId);
    return { profileId, equipped: { ...record?.equipped } };
  }
}
