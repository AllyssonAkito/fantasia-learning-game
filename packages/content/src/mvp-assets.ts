export interface ContentAsset {
  id: string;
  kind: 'raster-image';
  source: string;
  alt: string;
  width: number;
  height: number;
  license: 'Original project artwork';
  licenseUrl: string;
  legibility: 'verified-at-96px';
  crop?: 'top' | 'middle' | 'bottom';
}

const assetLicense = '/docs/ASSET-LICENSES.md#ilustracoes-de-atividade';

function illustration(id: string, alt: string): ContentAsset {
  return {
    id: `asset.symbol.${id}`,
    kind: 'raster-image',
    source: `/assets/activity/${id}.webp`,
    alt,
    width: 384,
    height: 384,
    license: 'Original project artwork',
    licenseUrl: assetLicense,
    legibility: 'verified-at-96px',
  };
}

function characterPiece(
  character: 'dog' | 'bunny',
  label: string,
  crop: 'top' | 'middle' | 'bottom',
): ContentAsset {
  const filenames = {
    dog: 'cachorrinho-chibi.webp',
    bunny: 'coelhinho-chibi.webp',
  } as const;
  return {
    id: `asset.character.${character}.${crop}`,
    kind: 'raster-image',
    source: `/assets/characters/${filenames[character]}`,
    alt: `${label}, parte ${crop === 'top' ? 'de cima' : crop === 'middle' ? 'do meio' : 'de baixo'}`,
    width: 512,
    height: 512,
    crop,
    license: 'Original project artwork',
    licenseUrl: assetLicense,
    legibility: 'verified-at-96px',
  };
}

export const mvpAssets = [
  illustration('star', 'estrela amarela'),
  illustration('heart', 'coração roxo'),
  illustration('circle', 'círculo azul'),
  illustration('square', 'quadrado laranja'),
  illustration('triangle', 'triângulo vermelho'),
  illustration('rabbit', 'coelhinho'),
  illustration('dog', 'cachorrinho'),
  illustration('fish', 'peixinho'),
  illustration('carrot', 'cenoura'),
  illustration('apple', 'maçã'),
  illustration('ball', 'bola colorida'),
  illustration('flower', 'flor amarela'),
  characterPiece('dog', 'cachorrinho', 'top'),
  characterPiece('dog', 'cachorrinho', 'middle'),
  characterPiece('dog', 'cachorrinho', 'bottom'),
  characterPiece('bunny', 'coelhinho', 'top'),
  characterPiece('bunny', 'coelhinho', 'middle'),
  characterPiece('bunny', 'coelhinho', 'bottom'),
] as const;

export const mvpAssetById = new Map(
  mvpAssets.map((asset) => [asset.id, asset]),
);
