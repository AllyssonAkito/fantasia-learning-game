import type {
  Activity,
  Course,
  EngineId,
  Level,
  Skill,
  Trail,
} from './schemas';
import type { ContentCatalogSeed } from './catalog';
import { mvpAssets } from './mvp-assets';

interface SkillBlueprint {
  id: string;
  title: string;
  label: string;
  engine: EngineId;
  instruction: string;
}

interface AreaBlueprint {
  id: string;
  label: string;
  icon: string;
  skills: readonly [SkillBlueprint, SkillBlueprint, SkillBlueprint];
}

const areas: readonly AreaBlueprint[] = [
  {
    id: 'logic',
    label: 'Lógica',
    icon: 'icon.blocks',
    skills: [
      {
        id: 'patterns',
        title: 'Padrões simples',
        label: 'Padrões',
        engine: 'sequence',
        instruction: 'O que vem depois?',
      },
      {
        id: 'ordering',
        title: 'Ordem de partes',
        label: 'Montar',
        engine: 'assembly',
        instruction: 'Monte na ordem certa.',
      },
      {
        id: 'deduction',
        title: 'Dedução visual',
        label: 'Descobrir',
        engine: 'choice',
        instruction: 'Que figura está escondida?',
      },
    ],
  },
  {
    id: 'attention',
    label: 'Atenção',
    icon: 'icon.star',
    skills: [
      {
        id: 'visual-search',
        title: 'Busca visual',
        label: 'Procurar',
        engine: 'choice',
        instruction: 'Ache a figura diferente.',
      },
      {
        id: 'details',
        title: 'Atenção aos detalhes',
        label: 'Detalhes',
        engine: 'memory',
        instruction: 'Olhe bem e lembre a ordem.',
      },
      {
        id: 'focus',
        title: 'Foco em categorias',
        label: 'Separar',
        engine: 'classification',
        instruction: 'Coloque cada figura no grupo.',
      },
    ],
  },
  {
    id: 'association',
    label: 'Combinar',
    icon: 'icon.pairs',
    skills: [
      {
        id: 'pairs',
        title: 'Pares relacionados',
        label: 'Pares',
        engine: 'association',
        instruction: 'Junte os pares amigos.',
      },
      {
        id: 'places',
        title: 'Objetos e lugares',
        label: 'Lugares',
        engine: 'drag',
        instruction: 'Leve cada figura ao seu lugar.',
      },
      {
        id: 'categories',
        title: 'Categorias do cotidiano',
        label: 'Grupos',
        engine: 'classification',
        instruction: 'Separe as figuras em grupos.',
      },
    ],
  },
  {
    id: 'numbers',
    label: 'Números',
    icon: 'icon.numbers',
    skills: [
      {
        id: 'quantities',
        title: 'Comparar quantidades',
        label: 'Quantidades',
        engine: 'comparison',
        instruction: 'Qual grupo tem mais?',
      },
      {
        id: 'counting',
        title: 'Contagem visual',
        label: 'Contar',
        engine: 'choice',
        instruction: 'Conte e escolha a resposta.',
      },
      {
        id: 'numeric-order',
        title: 'Ordem crescente',
        label: 'Ordem',
        engine: 'sequence',
        instruction: 'Qual número vem depois?',
      },
    ],
  },
  {
    id: 'shapes',
    label: 'Formas',
    icon: 'icon.shapes',
    skills: [
      {
        id: 'colors',
        title: 'Cores e formas',
        label: 'Cores',
        engine: 'classification',
        instruction: 'Separe por cor ou forma.',
      },
      {
        id: 'sizes',
        title: 'Tamanhos',
        label: 'Tamanhos',
        engine: 'comparison',
        instruction: 'Qual figura é maior?',
      },
      {
        id: 'composition',
        title: 'Composição de formas',
        label: 'Construir',
        engine: 'assembly',
        instruction: 'Monte a figura com as partes.',
      },
    ],
  },
  {
    id: 'memory',
    label: 'Memória',
    icon: 'icon.cards',
    skills: [
      {
        id: 'pairs',
        title: 'Memória de pares',
        label: 'Pares',
        engine: 'memory',
        instruction: 'Encontre os pares iguais.',
      },
      {
        id: 'positions',
        title: 'Memória de posições',
        label: 'Posições',
        engine: 'memory',
        instruction: 'Lembre onde cada figura estava.',
      },
      {
        id: 'visual-sequence',
        title: 'Memória de sequência',
        label: 'Sequência',
        engine: 'memory',
        instruction: 'Repita a ordem das figuras.',
      },
    ],
  },
] as const;

const common = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  status: 'published',
} as const;

const tokenPool = mvpAssets.map((asset) => ({
  id: asset.id,
  label: asset.alt,
}));

function tokens(offset: number) {
  return [0, 1, 2, 3].map(
    (step) => tokenPool[(offset + step) % tokenPool.length]!,
  );
}

const assemblyCharacters = ['dog', 'bunny'] as const;

const deductionChallenges = [
  {
    clueId: 'asset.symbol.rabbit',
    focusX: 'right',
    focusY: 'top',
    optionIds: ['asset.symbol.rabbit', 'asset.symbol.dog', 'asset.symbol.fish'],
  },
  {
    clueId: 'asset.symbol.dog',
    focusX: 'center',
    focusY: 'top',
    optionIds: ['asset.symbol.dog', 'asset.symbol.rabbit', 'asset.symbol.ball'],
  },
  {
    clueId: 'asset.symbol.fish',
    focusX: 'right',
    focusY: 'center',
    optionIds: [
      'asset.symbol.fish',
      'asset.symbol.flower',
      'asset.symbol.ball',
    ],
  },
  {
    clueId: 'asset.symbol.carrot',
    focusX: 'center',
    focusY: 'top',
    optionIds: [
      'asset.symbol.carrot',
      'asset.symbol.apple',
      'asset.symbol.flower',
    ],
  },
  {
    clueId: 'asset.symbol.apple',
    focusX: 'right',
    focusY: 'top',
    optionIds: [
      'asset.symbol.apple',
      'asset.symbol.ball',
      'asset.symbol.circle',
    ],
  },
  {
    clueId: 'asset.symbol.flower',
    focusX: 'left',
    focusY: 'center',
    optionIds: [
      'asset.symbol.flower',
      'asset.symbol.star',
      'asset.symbol.carrot',
    ],
  },
] as const;

function deductionContent(difficulty: number, index: number) {
  const challenge = deductionChallenges[index % deductionChallenges.length]!;
  return {
    difficulty,
    prompt: 'Descubra qual figura aparece no recorte.',
    clue: {
      assetId: challenge.clueId,
      focusX: challenge.focusX,
      focusY: challenge.focusY,
    },
    options: challenge.optionIds.map((id) => ({
      id,
      label: mvpAssets.find((asset) => asset.id === id)!.alt,
    })),
    correctOptionId: challenge.clueId,
  };
}

function characterPieces(offset: number) {
  const character = assemblyCharacters[offset % assemblyCharacters.length]!;
  return (['top', 'middle', 'bottom'] as const).map((crop, order) => ({
    id: `asset.character.${character}.${crop}`,
    slotId: crop,
    order,
  }));
}

function engineContent(engine: EngineId, difficulty: number, offset: number) {
  const [first, second, third] = tokens(offset);
  const base = { difficulty, prompt: 'Observe as figuras e escolha.' };
  switch (engine) {
    case 'choice':
      return {
        ...base,
        options: [first, second, third],
        correctOptionId: first!.id,
      };
    case 'drag':
      return {
        ...base,
        items: [
          { id: first!.id, targetId: 'target-one' },
          { id: second!.id, targetId: 'target-two' },
        ],
        targets: [
          { id: 'target-one', label: 'Lugar 1' },
          { id: 'target-two', label: 'Lugar 2' },
        ],
      };
    case 'sequence':
      return {
        ...base,
        pattern: [first!.id, second!.id, first!.id],
        options: [first, second, third],
        expectedId: second!.id,
      };
    case 'association':
      return {
        ...base,
        mode: 'one-to-one',
        relations: { [first!.id]: second!.id, [third!.id]: first!.id },
      };
    case 'classification':
      return {
        ...base,
        groups: [
          { id: 'group-one', label: 'Grupo 1' },
          { id: 'group-two', label: 'Grupo 2' },
        ],
        assignments: {
          [first!.id]: 'group-one',
          [second!.id]: 'group-two',
          [third!.id]: 'group-one',
        },
      };
    case 'memory':
      return {
        ...base,
        mode: offset % 2 === 0 ? 'pairs' : 'sequence',
        expected: [first!.id, second!.id, first!.id, second!.id],
        revealMs: Math.max(1200, 3200 - difficulty * 250),
      };
    case 'comparison':
      return {
        ...base,
        dimension: offset % 2 === 0 ? 'quantity' : 'size',
        candidates: [
          { id: first!.id, value: difficulty + 1 },
          { id: second!.id, value: difficulty + 3 },
        ],
        expectedId: second!.id,
      };
    case 'assembly':
      return {
        ...base,
        pieces: characterPieces(offset),
        snapTolerance: difficulty <= 3 ? 48 : 32,
        resetOnIncorrect: true,
      };
  }
}

const courses: Course[] = [];
const trails: Trail[] = [];
const skills: Skill[] = [];
const levels: Level[] = [];
const activities: Activity[] = [];

for (const [areaOrder, area] of areas.entries()) {
  const courseId = `course.${area.id}`;
  const trailId = `trail.${area.id}.adventure`;
  courses.push({
    ...common,
    id: courseId,
    title: `Área ${area.label}`,
    order: areaOrder,
    presentation: { label: area.label, icon: area.icon },
  });
  trails.push({
    ...common,
    id: trailId,
    courseId,
    title: `Aventura de ${area.label}`,
    order: 0,
    presentation: { label: 'Aventura', icon: area.icon },
  });

  for (const [skillOrder, skill] of area.skills.entries()) {
    const skillId = `skill.${area.id}.${skill.id}`;
    const levelId = `level.${area.id}.${skill.id}.01`;
    skills.push({
      ...common,
      id: skillId,
      trailId,
      title: skill.title,
      order: skillOrder,
    });
    levels.push({
      ...common,
      id: levelId,
      skillId,
      title: skill.title,
      order: 0,
      difficulty: skillOrder * 2 + 1,
      presentation: { label: skill.label, icon: area.icon },
    });

    for (let index = 0; index < 6; index += 1) {
      const difficulty = index + 1;
      const offset = areaOrder * 3 + skillOrder + index;
      const content =
        skill.id === 'deduction'
          ? deductionContent(difficulty, index)
          : engineContent(skill.engine, difficulty, offset);
      activities.push({
        ...common,
        id: `activity.${area.id}.${skill.id}.${String(index + 1).padStart(3, '0')}`,
        levelId,
        title: `${skill.title} ${index + 1}`,
        order: index,
        engine: skill.engine,
        difficulty,
        instruction: { text: skill.instruction, ttsFallback: true },
        content,
        hints: [
          { type: 'encourage' },
          { type: 'highlight-region' },
          { type: 'demonstrate-logic' },
        ],
        reward: {
          stars: difficulty <= 2 ? 1 : difficulty <= 4 ? 2 : 3,
          coins: 2,
        },
        assets:
          skill.id === 'deduction'
            ? [...deductionChallenges[index]!.optionIds]
            : skill.engine === 'assembly'
              ? characterPieces(offset).map((piece) => piece.id)
              : tokens(offset)
                  .slice(0, 3)
                  .map((token) => token.id),
      });
    }
  }
}

interface ExpansionLevelBlueprint {
  id: 'journey-a' | 'journey-b' | 'journey-c';
  label: string;
  title: string;
  difficulty: number;
  activities: readonly Omit<
    Activity,
    | 'schemaVersion'
    | 'contentVersion'
    | 'status'
    | 'levelId'
    | 'hints'
    | 'reward'
  >[];
}

const expansionLevels: readonly ExpansionLevelBlueprint[] = [
  {
    id: 'journey-a',
    label: 'Reconhecer',
    title: 'Reconhecer imagens e padrões',
    difficulty: 2,
    activities: [
      {
        id: 'activity.shapes.journey-a.001',
        title: 'Reconhecer a forma redonda',
        order: 0,
        engine: 'choice',
        difficulty: 1,
        instruction: { text: 'Toque na figura redonda.', ttsFallback: true },
        content: {
          difficulty: 1,
          prompt: 'Toque na figura redonda.',
          options: [
            { id: 'asset.symbol.circle', label: 'círculo azul' },
            { id: 'asset.symbol.triangle', label: 'triângulo vermelho' },
          ],
          correctOptionId: 'asset.symbol.circle',
        },
        assets: ['asset.symbol.circle', 'asset.symbol.triangle'],
      },
      {
        id: 'activity.association.journey-a.002',
        title: 'Juntar amigos e objetos',
        order: 1,
        engine: 'association',
        difficulty: 2,
        instruction: {
          text: 'Leve cada objeto até o amigo certo.',
          ttsFallback: true,
        },
        content: {
          difficulty: 2,
          prompt: 'Leve cada objeto até o amigo certo.',
          mode: 'one-to-one',
          relations: {
            'asset.symbol.carrot': 'asset.symbol.rabbit',
            'asset.symbol.ball': 'asset.symbol.dog',
          },
        },
        assets: [
          'asset.symbol.carrot',
          'asset.symbol.rabbit',
          'asset.symbol.ball',
          'asset.symbol.dog',
        ],
      },
      {
        id: 'activity.logic.journey-a.003',
        title: 'Continuar sequência alternada',
        order: 2,
        engine: 'sequence',
        difficulty: 2,
        instruction: { text: 'O que vem depois?', ttsFallback: true },
        content: {
          difficulty: 2,
          prompt: 'O que vem depois?',
          pattern: [
            'asset.symbol.star',
            'asset.symbol.heart',
            'asset.symbol.star',
          ],
          options: [
            { id: 'asset.symbol.star', label: 'estrela amarela' },
            { id: 'asset.symbol.heart', label: 'coração roxo' },
          ],
          expectedId: 'asset.symbol.heart',
        },
        assets: ['asset.symbol.star', 'asset.symbol.heart'],
      },
      {
        id: 'activity.attention.journey-a.004',
        title: 'Separar pelas formas parecidas',
        order: 3,
        engine: 'classification',
        difficulty: 2,
        instruction: {
          text: 'Junte as figuras com formas parecidas.',
          ttsFallback: true,
        },
        content: {
          difficulty: 2,
          prompt: 'Junte as figuras com formas parecidas.',
          groups: [
            { id: 'asset.symbol.circle', label: 'grupo redondo' },
            { id: 'asset.symbol.triangle', label: 'grupo pontudo' },
          ],
          assignments: {
            'asset.symbol.apple': 'asset.symbol.circle',
            'asset.symbol.ball': 'asset.symbol.circle',
            'asset.symbol.carrot': 'asset.symbol.triangle',
          },
        },
        assets: [
          'asset.symbol.circle',
          'asset.symbol.triangle',
          'asset.symbol.apple',
          'asset.symbol.ball',
          'asset.symbol.carrot',
        ],
      },
      {
        id: 'activity.numbers.journey-a.005',
        title: 'Comparar quantidades pequenas',
        order: 4,
        engine: 'comparison',
        difficulty: 2,
        instruction: { text: 'Qual grupo tem mais?', ttsFallback: true },
        content: {
          difficulty: 2,
          prompt: 'Qual grupo tem mais?',
          dimension: 'quantity',
          candidates: [
            { id: 'asset.symbol.apple', value: 2 },
            { id: 'asset.symbol.carrot', value: 3 },
          ],
          expectedId: 'asset.symbol.carrot',
        },
        assets: ['asset.symbol.apple', 'asset.symbol.carrot'],
      },
      {
        id: 'activity.memory.journey-a.006',
        title: 'Montar o cachorrinho',
        order: 5,
        engine: 'assembly',
        difficulty: 2,
        instruction: {
          text: 'Monte o cachorrinho de cima para baixo.',
          ttsFallback: true,
        },
        content: {
          difficulty: 2,
          prompt: 'Monte o cachorrinho de cima para baixo.',
          pieces: characterPieces(0),
          snapTolerance: 48,
          resetOnIncorrect: true,
        },
        assets: characterPieces(0).map((piece) => piece.id),
      },
    ],
  },
  {
    id: 'journey-b',
    label: 'Relacionar',
    title: 'Relacionar ideias e posições',
    difficulty: 4,
    activities: [
      {
        id: 'activity.attention.journey-b.001',
        title: 'Encontrar o diferente',
        order: 0,
        engine: 'choice',
        difficulty: 3,
        instruction: { text: 'Qual não é um animal?', ttsFallback: true },
        content: {
          difficulty: 3,
          prompt: 'Qual não é um animal?',
          options: [
            { id: 'asset.symbol.rabbit', label: 'coelhinho' },
            { id: 'asset.symbol.dog', label: 'cachorrinho' },
            { id: 'asset.symbol.carrot', label: 'cenoura' },
          ],
          correctOptionId: 'asset.symbol.carrot',
        },
        assets: [
          'asset.symbol.rabbit',
          'asset.symbol.dog',
          'asset.symbol.carrot',
        ],
      },
      {
        id: 'activity.association.journey-b.002',
        title: 'Levar objetos aos amigos',
        order: 1,
        engine: 'drag',
        difficulty: 3,
        instruction: {
          text: 'Arraste cada objeto até o amigo certo.',
          ttsFallback: true,
        },
        content: {
          difficulty: 3,
          prompt: 'Arraste cada objeto até o amigo certo.',
          items: [
            { id: 'asset.symbol.carrot', targetId: 'asset.symbol.rabbit' },
            { id: 'asset.symbol.ball', targetId: 'asset.symbol.dog' },
          ],
          targets: [
            { id: 'asset.symbol.rabbit', label: 'coelhinho' },
            { id: 'asset.symbol.dog', label: 'cachorrinho' },
          ],
        },
        assets: [
          'asset.symbol.carrot',
          'asset.symbol.rabbit',
          'asset.symbol.ball',
          'asset.symbol.dog',
        ],
      },
      {
        id: 'activity.logic.journey-b.003',
        title: 'Continuar sequência AAB',
        order: 2,
        engine: 'sequence',
        difficulty: 4,
        instruction: { text: 'O que vem depois?', ttsFallback: true },
        content: {
          difficulty: 4,
          prompt: 'O que vem depois?',
          pattern: [
            'asset.symbol.star',
            'asset.symbol.star',
            'asset.symbol.heart',
            'asset.symbol.star',
            'asset.symbol.star',
          ],
          options: [
            { id: 'asset.symbol.star', label: 'estrela amarela' },
            { id: 'asset.symbol.heart', label: 'coração roxo' },
            { id: 'asset.symbol.circle', label: 'círculo azul' },
          ],
          expectedId: 'asset.symbol.heart',
        },
        assets: [
          'asset.symbol.star',
          'asset.symbol.heart',
          'asset.symbol.circle',
        ],
      },
      {
        id: 'activity.memory.journey-b.004',
        title: 'Lembrar três figuras',
        order: 3,
        engine: 'memory',
        difficulty: 4,
        instruction: {
          text: 'Olhe as figuras e depois toque na mesma ordem.',
          ttsFallback: true,
        },
        content: {
          difficulty: 4,
          prompt: 'Olhe as figuras e depois toque na mesma ordem.',
          mode: 'sequence',
          expected: [
            'asset.symbol.flower',
            'asset.symbol.apple',
            'asset.symbol.ball',
          ],
          revealMs: 1800,
        },
        assets: [
          'asset.symbol.flower',
          'asset.symbol.apple',
          'asset.symbol.ball',
        ],
      },
      {
        id: 'activity.shapes.journey-b.005',
        title: 'Reconhecer acima e abaixo',
        order: 4,
        engine: 'choice',
        difficulty: 4,
        instruction: {
          text: 'Onde a bola está acima do quadrado?',
          ttsFallback: true,
        },
        content: {
          difficulty: 4,
          prompt: 'Onde a bola está acima do quadrado?',
          options: [
            {
              id: 'asset.scene.ball-above-square',
              label: 'bola acima do quadrado',
            },
            {
              id: 'asset.scene.ball-below-square',
              label: 'bola abaixo do quadrado',
            },
          ],
          correctOptionId: 'asset.scene.ball-above-square',
        },
        assets: [
          'asset.scene.ball-above-square',
          'asset.scene.ball-below-square',
        ],
      },
      {
        id: 'activity.numbers.journey-b.006',
        title: 'Completar o nome Melina',
        order: 5,
        engine: 'sequence',
        difficulty: 4,
        instruction: {
          text: 'Melina. Qual letra completa o nome? M, E, L, I, N...',
          ttsFallback: true,
        },
        content: {
          difficulty: 4,
          prompt: 'Qual letra completa o nome Melina?',
          pattern: [
            'asset.letter.m',
            'asset.letter.e',
            'asset.letter.l',
            'asset.letter.i',
            'asset.letter.n',
          ],
          options: [
            { id: 'asset.letter.a', label: 'letra A' },
            { id: 'asset.letter.m', label: 'letra M' },
            { id: 'asset.letter.n', label: 'letra N' },
          ],
          expectedId: 'asset.letter.a',
        },
        assets: [
          'asset.letter.m',
          'asset.letter.e',
          'asset.letter.l',
          'asset.letter.i',
          'asset.letter.n',
          'asset.letter.a',
        ],
      },
    ],
  },
  {
    id: 'journey-c',
    label: 'Combinar',
    title: 'Combinar atributos e sequências',
    difficulty: 6,
    activities: [
      {
        id: 'activity.shapes.journey-c.001',
        title: 'Escolher com dois atributos',
        order: 0,
        engine: 'choice',
        difficulty: 5,
        instruction: {
          text: 'Qual figura é vermelha e redonda?',
          ttsFallback: true,
        },
        content: {
          difficulty: 5,
          prompt: 'Qual figura é vermelha e redonda?',
          options: [
            { id: 'asset.symbol.apple', label: 'maçã vermelha redonda' },
            { id: 'asset.symbol.ball', label: 'bola colorida redonda' },
            { id: 'asset.symbol.triangle', label: 'triângulo vermelho' },
            { id: 'asset.symbol.flower', label: 'flor amarela' },
          ],
          correctOptionId: 'asset.symbol.apple',
        },
        assets: [
          'asset.symbol.apple',
          'asset.symbol.ball',
          'asset.symbol.triangle',
          'asset.symbol.flower',
        ],
      },
      {
        id: 'activity.attention.journey-c.002',
        title: 'Separar em três grupos',
        order: 1,
        engine: 'classification',
        difficulty: 5,
        instruction: {
          text: 'Junte cada figura com a forma parecida.',
          ttsFallback: true,
        },
        content: {
          difficulty: 5,
          prompt: 'Junte cada figura com a forma parecida.',
          groups: [
            { id: 'asset.symbol.circle', label: 'grupo redondo' },
            { id: 'asset.symbol.square', label: 'grupo quadrado' },
            { id: 'asset.symbol.triangle', label: 'grupo triangular' },
          ],
          assignments: {
            'asset.symbol.ball': 'asset.symbol.circle',
            'asset.symbol.apple': 'asset.symbol.circle',
            'asset.symbol.square': 'asset.symbol.square',
            'asset.symbol.carrot': 'asset.symbol.triangle',
          },
        },
        assets: [
          'asset.symbol.circle',
          'asset.symbol.square',
          'asset.symbol.triangle',
          'asset.symbol.ball',
          'asset.symbol.apple',
          'asset.symbol.carrot',
        ],
      },
      {
        id: 'activity.logic.journey-c.003',
        title: 'Continuar sequência ABC',
        order: 2,
        engine: 'sequence',
        difficulty: 6,
        instruction: { text: 'O que vem depois?', ttsFallback: true },
        content: {
          difficulty: 6,
          prompt: 'O que vem depois?',
          pattern: [
            'asset.symbol.star',
            'asset.symbol.heart',
            'asset.symbol.circle',
            'asset.symbol.star',
            'asset.symbol.heart',
          ],
          options: [
            { id: 'asset.symbol.star', label: 'estrela amarela' },
            { id: 'asset.symbol.heart', label: 'coração roxo' },
            { id: 'asset.symbol.circle', label: 'círculo azul' },
            { id: 'asset.symbol.square', label: 'quadrado laranja' },
          ],
          expectedId: 'asset.symbol.circle',
        },
        assets: [
          'asset.symbol.star',
          'asset.symbol.heart',
          'asset.symbol.circle',
          'asset.symbol.square',
        ],
      },
      {
        id: 'activity.association.journey-c.004',
        title: 'Relacionar três formas parecidas',
        order: 3,
        engine: 'association',
        difficulty: 6,
        instruction: {
          text: 'Leve cada objeto até a forma parecida.',
          ttsFallback: true,
        },
        content: {
          difficulty: 6,
          prompt: 'Leve cada objeto até a forma parecida.',
          mode: 'one-to-one',
          relations: {
            'asset.symbol.carrot': 'asset.symbol.triangle',
            'asset.symbol.ball': 'asset.symbol.circle',
            'asset.symbol.flower': 'asset.symbol.star',
          },
        },
        assets: [
          'asset.symbol.carrot',
          'asset.symbol.triangle',
          'asset.symbol.ball',
          'asset.symbol.circle',
          'asset.symbol.flower',
          'asset.symbol.star',
        ],
      },
      {
        id: 'activity.numbers.journey-c.005',
        title: 'Comparar tamanhos',
        order: 4,
        engine: 'comparison',
        difficulty: 6,
        instruction: { text: 'Qual figura é maior?', ttsFallback: true },
        content: {
          difficulty: 6,
          prompt: 'Qual figura é maior?',
          dimension: 'size',
          candidates: [
            { id: 'asset.symbol.flower', value: 2 },
            { id: 'asset.symbol.apple', value: 3 },
            { id: 'asset.symbol.ball', value: 4 },
            { id: 'asset.symbol.star', value: 1 },
          ],
          expectedId: 'asset.symbol.ball',
        },
        assets: [
          'asset.symbol.flower',
          'asset.symbol.apple',
          'asset.symbol.ball',
          'asset.symbol.star',
        ],
      },
      {
        id: 'activity.memory.journey-c.006',
        title: 'Ordenar as letras de Melina',
        order: 5,
        engine: 'memory',
        difficulty: 6,
        instruction: {
          text: 'Melina. Toque nas letras na ordem: M, E, L, I, N, A.',
          ttsFallback: true,
        },
        content: {
          difficulty: 6,
          prompt: 'Toque nas letras do nome Melina na ordem.',
          mode: 'sequence',
          expected: [
            'asset.letter.m',
            'asset.letter.e',
            'asset.letter.l',
            'asset.letter.i',
            'asset.letter.n',
            'asset.letter.a',
          ],
          revealMs: 2400,
        },
        assets: [
          'asset.letter.m',
          'asset.letter.e',
          'asset.letter.l',
          'asset.letter.i',
          'asset.letter.n',
          'asset.letter.a',
        ],
      },
    ],
  },
] as const;

for (const [levelOrder, blueprint] of expansionLevels.entries()) {
  const skillId = `skill.logic.${blueprint.id}`;
  const levelId = `level.logic.${blueprint.id}.01`;
  skills.push({
    ...common,
    id: skillId,
    trailId: 'trail.logic.adventure',
    title: blueprint.title,
    order: levelOrder + 3,
  });
  levels.push({
    ...common,
    id: levelId,
    skillId,
    title: blueprint.title,
    order: 0,
    difficulty: blueprint.difficulty,
    presentation: { label: blueprint.label, icon: 'icon.star' },
  });
  for (const activity of blueprint.activities) {
    activities.push({
      ...common,
      ...activity,
      levelId,
      hints: [
        { type: 'encourage' },
        { type: 'highlight-region' },
        { type: 'demonstrate-logic' },
      ],
      reward: {
        stars: activity.difficulty <= 2 ? 1 : activity.difficulty <= 4 ? 2 : 3,
        coins: 2,
      },
    });
  }
}

export const mvpCatalogSeed: ContentCatalogSeed = {
  courses,
  trails,
  skills,
  levels,
  activities,
};

export interface ContentCoverageEntry {
  activityId: string;
  area: string;
  skill: string;
  engine: EngineId;
  difficulty: number;
}

export const mvpContentCoverage: readonly ContentCoverageEntry[] =
  activities.map((activity) => {
    const [, area, skill] = activity.id.split('.');
    return {
      activityId: activity.id,
      area: area!,
      skill: `${area!}.${skill!}`,
      engine: activity.engine,
      difficulty: activity.difficulty,
    };
  });
