export interface ContentAsset {
  id: string;
  kind: 'raster-image' | 'letter-tile' | 'composite-image' | 'sprite-image';
  source?: string;
  alt: string;
  width: number;
  height: number;
  license: 'Original project artwork';
  licenseUrl: string;
  legibility: 'verified-at-96px';
  crop?: 'top' | 'middle' | 'bottom';
  letter?: string;
  tone?: 'sun' | 'sky' | 'berry' | 'mint' | 'coral' | 'lilac';
  sprite?: {
    columns: number;
    rows: number;
    column: number;
    row: number;
  };
  components?: readonly {
    assetId: string;
    position: 'top' | 'bottom';
  }[];
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

function letterTile(
  letter: 'M' | 'E' | 'L' | 'I' | 'N' | 'A',
  tone: NonNullable<ContentAsset['tone']>,
): ContentAsset {
  return {
    id: `asset.letter.${letter.toLowerCase()}`,
    kind: 'letter-tile',
    alt: `letra ${letter}`,
    letter,
    tone,
    width: 384,
    height: 384,
    license: 'Original project artwork',
    licenseUrl: assetLicense,
    legibility: 'verified-at-96px',
  };
}

function positionScene(
  id: 'above' | 'below',
  positions: readonly ['top' | 'bottom', 'top' | 'bottom'],
): ContentAsset {
  return {
    id: `asset.scene.ball-${id}-square`,
    kind: 'composite-image',
    alt: `bola ${id === 'above' ? 'acima' : 'abaixo'} do quadrado`,
    components: [
      { assetId: 'asset.symbol.ball', position: positions[0] },
      { assetId: 'asset.symbol.square', position: positions[1] },
    ],
    width: 384,
    height: 384,
    license: 'Original project artwork',
    licenseUrl: assetLicense,
    legibility: 'verified-at-96px',
  };
}

function oddTreeSprite(
  id: 'tall' | 'round' | 'narrow' | 'puppy',
  alt: string,
  column: 0 | 1,
  row: 0 | 1,
): ContentAsset {
  return {
    id: `asset.game.odd-tree.${id}`,
    kind: 'sprite-image',
    source: '/assets/activity/odd-tree-sprite.webp',
    alt,
    width: 512,
    height: 512,
    sprite: { columns: 2, rows: 2, column, row },
    license: 'Original project artwork',
    licenseUrl: assetLicense,
    legibility: 'verified-at-96px',
  };
}

function oddSceneSprite(
  sheet: 'locks' | 'planets' | 'starfish' | 'butterfly' | 'octopus',
  id: string,
  alt: string,
  column: 0 | 1,
  row: 0 | 1,
): ContentAsset {
  return {
    id: `asset.game.odd-${sheet}.${id}`,
    kind: 'sprite-image',
    source: `/assets/activity/odd-${sheet}-sprite.webp`,
    alt,
    width: 512,
    height: 512,
    sprite: { columns: 2, rows: 2, column, row },
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
  letterTile('M', 'berry'),
  letterTile('E', 'sky'),
  letterTile('L', 'mint'),
  letterTile('I', 'coral'),
  letterTile('N', 'lilac'),
  letterTile('A', 'sun'),
  positionScene('above', ['top', 'bottom']),
  positionScene('below', ['bottom', 'top']),
  oddTreeSprite('tall', 'pinheiro alto verde-menta', 0, 0),
  oddTreeSprite('round', 'pinheiro arredondado verde-claro', 1, 0),
  oddTreeSprite('narrow', 'pinheiro estreito verde-escuro', 0, 1),
  oddTreeSprite('puppy', 'cachorrinho escondido no pinheiro', 1, 1),
  oddSceneSprite('locks', 'mint-lock', 'cadeado quadrado verde-menta', 0, 0),
  oddSceneSprite('locks', 'heart-lock', 'cadeado de coração lilás', 1, 0),
  oddSceneSprite('locks', 'round-lock', 'cadeado redondo azul', 0, 1),
  oddSceneSprite('locks', 'gold-key', 'chave dourada', 1, 1),
  oddSceneSprite('planets', 'ringed-lilac', 'planeta lilás com anel', 0, 0),
  oddSceneSprite('planets', 'round-lilac', 'planeta lilás redondo', 1, 0),
  oddSceneSprite('planets', 'berry-lilac', 'planeta lilás escuro', 0, 1),
  oddSceneSprite('planets', 'yellow', 'planeta amarelo com anel verde', 1, 1),
  oddSceneSprite('starfish', 'blue-fish', 'peixinho azul', 0, 0),
  oddSceneSprite('starfish', 'mint-fish', 'peixinho verde-menta', 1, 0),
  oddSceneSprite('starfish', 'yellow-star', 'estrela-do-mar amarela', 0, 1),
  oddSceneSprite('starfish', 'lilac-fish', 'peixinho lilás', 1, 1),
  oddSceneSprite('butterfly', 'lilac-butterfly', 'borboleta lilás', 0, 0),
  oddSceneSprite('butterfly', 'brown-bird', 'passarinho marrom', 1, 0),
  oddSceneSprite('butterfly', 'yellow-bird', 'passarinho amarelo', 0, 1),
  oddSceneSprite('butterfly', 'coral-bird', 'passarinho coral', 1, 1),
  oddSceneSprite('octopus', 'mint-fish', 'peixe tropical verde-menta', 0, 0),
  oddSceneSprite('octopus', 'coral-fish', 'peixe tropical coral', 1, 0),
  oddSceneSprite('octopus', 'blue-octopus', 'polvinho azul da Melina', 0, 1),
  oddSceneSprite('octopus', 'lilac-fish', 'peixe tropical lilás', 1, 1),
] as const;

export const mvpAssetById = new Map(
  mvpAssets.map((asset) => [asset.id, asset]),
);
