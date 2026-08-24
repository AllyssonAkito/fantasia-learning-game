export interface ContentAsset {
  id: string;
  kind: 'unicode-symbol';
  source: string;
  alt: string;
  width: 64;
  height: 64;
  license: 'Unicode Standard';
  licenseUrl: string;
  legibility: 'verified-at-56px';
}

const unicodeLicense = 'https://www.unicode.org/license.txt';

function symbol(id: string, source: string, alt: string): ContentAsset {
  return {
    id: `asset.symbol.${id}`,
    kind: 'unicode-symbol',
    source,
    alt,
    width: 64,
    height: 64,
    license: 'Unicode Standard',
    licenseUrl: unicodeLicense,
    legibility: 'verified-at-56px',
  };
}

export const mvpAssets = [
  symbol('star', '⭐', 'estrela amarela'),
  symbol('heart', '💜', 'coração roxo'),
  symbol('circle', '🔵', 'círculo azul'),
  symbol('square', '🟧', 'quadrado laranja'),
  symbol('triangle', '🔺', 'triângulo vermelho'),
  symbol('rabbit', '🐰', 'coelhinho'),
  symbol('dog', '🐶', 'cachorrinho'),
  symbol('fish', '🐟', 'peixinho'),
  symbol('carrot', '🥕', 'cenoura'),
  symbol('apple', '🍎', 'maçã'),
  symbol('ball', '⚽', 'bola'),
  symbol('flower', '🌼', 'flor'),
] as const;

export const mvpAssetById = new Map(
  mvpAssets.map((asset) => [asset.id, asset]),
);
