export interface AvatarDefinition {
  id: string;
  label: string;
  symbol: string;
  color: string;
}

export const avatarCatalog: readonly AvatarDefinition[] = Object.freeze([
  { id: 'avatar.dog', label: 'Cachorrinho', symbol: '🐶', color: '#4f9fc4' },
  { id: 'avatar.bunny', label: 'Coelhinho', symbol: '🐰', color: '#f5a9c5' },
  {
    id: 'avatar.yellow-friend',
    label: 'Amarelinho',
    symbol: '⚡',
    color: '#ffd83d',
  },
  {
    id: 'avatar.pink-octopus',
    label: 'Polvinho Rosa',
    symbol: '🐙',
    color: '#f48db6',
  },
  {
    id: 'avatar.blue-octopus',
    label: 'Polvinho Azul',
    symbol: '🐙',
    color: '#62bce8',
  },
]);

export function getAvatar(id: string): AvatarDefinition | null {
  return avatarCatalog.find((avatar) => avatar.id === id) ?? null;
}
