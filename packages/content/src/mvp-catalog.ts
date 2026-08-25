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
        instruction: 'Qual completa a brincadeira?',
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
      const content = engineContent(skill.engine, difficulty, offset);
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
          skill.engine === 'assembly'
            ? characterPieces(offset).map((piece) => piece.id)
            : tokens(offset)
                .slice(0, 3)
                .map((token) => token.id),
      });
    }
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
