import type { Activity, Course, Level, Skill, Trail } from './schemas';
import type { ContentCatalogSeed } from './catalog';

const areas = [
  { id: 'logic', label: 'Lógica', icon: 'icon.blocks', engine: 'sequence' },
  { id: 'attention', label: 'Atenção', icon: 'icon.star', engine: 'choice' },
  {
    id: 'association',
    label: 'Combinar',
    icon: 'icon.pairs',
    engine: 'association',
  },
  {
    id: 'numbers',
    label: 'Números',
    icon: 'icon.numbers',
    engine: 'comparison',
  },
  {
    id: 'shapes',
    label: 'Formas',
    icon: 'icon.shapes',
    engine: 'classification',
  },
  { id: 'memory', label: 'Memória', icon: 'icon.cards', engine: 'memory' },
] as const;

const common = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  status: 'published',
} as const;

const courses: Course[] = [];
const trails: Trail[] = [];
const skills: Skill[] = [];
const levels: Level[] = [];
const activities: Activity[] = [];

for (const [order, area] of areas.entries()) {
  const courseId = `course.${area.id}`;
  const trailId = `trail.${area.id}.first-steps`;
  const skillId = `skill.${area.id}.first-skill`;
  const levelId = `level.${area.id}.first-steps.01`;

  courses.push({
    ...common,
    id: courseId,
    title: `Área ${area.label}`,
    order,
    presentation: { label: area.label, icon: area.icon },
  });
  trails.push({
    ...common,
    id: trailId,
    courseId,
    title: `Primeiros passos de ${area.label}`,
    order: 0,
    presentation: { label: 'Primeiros passos', icon: area.icon },
  });
  skills.push({
    ...common,
    id: skillId,
    trailId,
    title: `Habilidade inicial de ${area.label}`,
    order: 0,
  });
  levels.push({
    ...common,
    id: levelId,
    skillId,
    title: `Nível inicial de ${area.label}`,
    order: 0,
    difficulty: 1,
    presentation: { label: 'Vamos brincar!', icon: area.icon },
  });
  activities.push({
    ...common,
    id: `activity.${area.id}.first.001`,
    levelId,
    title: `Atividade inicial de ${area.label}`,
    order: 0,
    engine: area.engine,
    difficulty: 1,
    instruction: { text: 'Vamos brincar?', ttsFallback: true },
    content: { example: true },
    hints: [],
    reward: { stars: 1, coins: 1 },
    assets: [],
  });
}

export const exampleCatalogSeed: ContentCatalogSeed = {
  courses,
  trails,
  skills,
  levels,
  activities,
};
