export interface InventoryItem {
  itemId: string;
  obtainedAt: string;
}

export interface ProfileInventory {
  profileId: string;
  items: InventoryItem[];
}

export class InventoryRepository {
  readonly #inventories = new Map<string, ProfileInventory>();

  obtain(profileId: string, item: InventoryItem): ProfileInventory {
    const current = this.#inventories.get(profileId) ?? {
      profileId,
      items: [],
    };
    if (!current.items.some((owned) => owned.itemId === item.itemId))
      current.items.push({ ...item });
    this.#inventories.set(profileId, current);
    return this.get(profileId);
  }

  get(profileId: string): ProfileInventory {
    const current = this.#inventories.get(profileId);
    return {
      profileId,
      items: current?.items.map((item) => ({ ...item })) ?? [],
    };
  }
}
