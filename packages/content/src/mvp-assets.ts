export interface ContentAsset {
  id: string;
  kind: 'raster-image';
  source: string;
  alt: string;
  width: 384;
  height: 384;
  license: 'Original project artwork';
  licenseUrl: string;
  legibility: 'verified-at-96px';
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
] as const;

export const mvpAssetById = new Map(
  mvpAssets.map((asset) => [asset.id, asset]),
);
