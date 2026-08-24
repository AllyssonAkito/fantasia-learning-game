export type EquipmentSlot = 'head' | 'neck' | 'hand';
export interface CatalogItem {
  id: string;
  label: string;
  slot: EquipmentSlot;
  icon: string;
  unlock: { kind: 'activity-reward'; activityId: string };
}
export const initialItemCatalog: readonly CatalogItem[] = Object.freeze([
  {
    id: 'item.bow.pink',
    label: 'Laço rosa',
    slot: 'head',
    icon: 'icon.item.bow-pink',
    unlock: {
      kind: 'activity-reward',
      activityId: 'activity.letters.name.001',
    },
  },
  {
    id: 'item.scarf.rainbow',
    label: 'Cachecol arco-íris',
    slot: 'neck',
    icon: 'icon.item.scarf-rainbow',
    unlock: { kind: 'activity-reward', activityId: 'activity.logic.first.001' },
  },
  {
    id: 'item.wand.star',
    label: 'Varinha de estrela',
    slot: 'hand',
    icon: 'icon.item.wand-star',
    unlock: {
      kind: 'activity-reward',
      activityId: 'activity.shapes.first.001',
    },
  },
]);
export function findCatalogItem(itemId: string): CatalogItem | null {
  return initialItemCatalog.find((item) => item.id === itemId) ?? null;
}
