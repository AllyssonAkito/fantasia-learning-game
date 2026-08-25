import type { ContentCatalog } from './catalog';
import type { Activity } from './schemas';
import {
  assemblyDefinitionSchema,
  choiceDefinitionSchema,
  classificationDefinitionSchema,
  memoryDefinitionSchema,
  sequenceDefinitionSchema,
} from '@fantasia/engines';

export interface LearningPathProgress {
  completedLevelIds?: ReadonlySet<string>;
  unlockedLevelIds?: ReadonlySet<string>;
}

export interface LearningPathStop {
  destinationId: string;
  label: string;
  icon: string;
  cover?: LearningPathCover;
  state: 'current' | 'locked' | 'completed';
}

export type LearningPathCover =
  | { kind: 'sequence'; assetIds: string[] }
  | { kind: 'assembly'; pieceIds: string[] }
  | { kind: 'search'; assetIds: string[] }
  | { kind: 'memory'; assetIds: string[] }
  | {
      kind: 'classification';
      itemIds: string[];
      targetIds: string[];
    }
  | {
      kind: 'clue';
      assetId: string;
      focusX: 'left' | 'center' | 'right';
      focusY: 'top' | 'center' | 'bottom';
    };

export type LearningPathView =
  | { status: 'empty'; stops: [] }
  | {
      status: 'ready';
      courseLabel: string;
      courseIcon: string;
      stops: LearningPathStop[];
    };

function buildLevelCover(activity: Activity | undefined) {
  if (!activity) return undefined;
  const isAttentionActivity = activity.levelId.startsWith('level.attention.');
  if (isAttentionActivity && activity.engine === 'choice') {
    const parsed = choiceDefinitionSchema.safeParse(activity.content);
    if (!parsed.success) return undefined;
    return {
      kind: 'search' as const,
      assetIds: parsed.data.options.map(({ id }) => id),
    };
  }
  if (isAttentionActivity && activity.engine === 'memory') {
    const parsed = memoryDefinitionSchema.safeParse(activity.content);
    if (!parsed.success) return undefined;
    return {
      kind: 'memory' as const,
      assetIds: parsed.data.expected.slice(0, 2),
    };
  }
  if (isAttentionActivity && activity.engine === 'classification') {
    const parsed = classificationDefinitionSchema.safeParse(activity.content);
    if (!parsed.success) return undefined;
    return {
      kind: 'classification' as const,
      itemIds: Object.keys(parsed.data.assignments).slice(0, 3),
      targetIds: parsed.data.groups.map(({ id }) => id),
    };
  }
  if (activity.engine === 'sequence') {
    const parsed = sequenceDefinitionSchema.safeParse(activity.content);
    if (!parsed.success) return undefined;
    return {
      kind: 'sequence' as const,
      assetIds: parsed.data.pattern.slice(0, 3),
    };
  }
  if (activity.engine === 'assembly') {
    const parsed = assemblyDefinitionSchema.safeParse(activity.content);
    if (!parsed.success) return undefined;
    return {
      kind: 'assembly' as const,
      pieceIds: [...parsed.data.pieces]
        .sort((left, right) => left.order - right.order)
        .map(({ id }) => id),
    };
  }
  if (activity.engine === 'choice') {
    const parsed = choiceDefinitionSchema.safeParse(activity.content);
    if (parsed.success && parsed.data.clue) {
      return { kind: 'clue' as const, ...parsed.data.clue };
    }
  }
  return undefined;
}

export function buildLearningPathView(
  catalog: ContentCatalog,
  courseId: string,
  progress: LearningPathProgress = {},
): LearningPathView {
  const course = catalog.getCourse(courseId);
  if (!course?.presentation) return { status: 'empty', stops: [] };

  const levels = catalog
    .getTrailsByCourse(courseId)
    .flatMap((trail) => catalog.getSkillsByTrail(trail.id))
    .flatMap((skill) => catalog.getLevelsBySkill(skill.id))
    .filter((level) => level.presentation);

  if (levels.length === 0) return { status: 'empty', stops: [] };

  const completed = progress.completedLevelIds ?? new Set<string>();
  const explicitUnlocked = progress.unlockedLevelIds;

  return {
    status: 'ready',
    courseLabel: course.presentation.label,
    courseIcon: course.presentation.icon,
    stops: levels.map((level, index) => {
      const cover = buildLevelCover(catalog.getActivitiesByLevel(level.id)[0]);
      return {
        destinationId: level.id,
        label: level.presentation!.label,
        icon: level.presentation!.icon,
        ...(cover ? { cover } : {}),
        state: completed.has(level.id)
          ? 'completed'
          : explicitUnlocked?.has(level.id) || index === 0
            ? 'current'
            : 'locked',
      };
    }),
  };
}
