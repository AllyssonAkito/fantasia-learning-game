import yellowFriend from '../../../../assets/characters/amarelinho-chibi.svg';
import dog from '../../../../assets/characters/cachorrinho-chibi.png';
import bunny from '../../../../assets/characters/coelhinho-chibi.png';
import blueOctopus from '../../../../assets/characters/polvinho-azul-chibi.png';
import pinkOctopus from '../../../../assets/characters/polvinho-rosa-chibi.png';

export const mascotAssets = {
  'avatar.dog': { label: 'Cachorrinho', src: dog },
  'avatar.bunny': { label: 'Coelhinho', src: bunny },
  'avatar.yellow-friend': { label: 'Amarelinho', src: yellowFriend },
  'avatar.pink-octopus': { label: 'Polvinho Rosa', src: pinkOctopus },
  'avatar.blue-octopus': { label: 'Polvinho Azul', src: blueOctopus },
} as const;

export type MascotAvatarId = keyof typeof mascotAssets;
