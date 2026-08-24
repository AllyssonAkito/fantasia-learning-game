import type { ContentCatalog } from './catalog';

export interface LearningPathProgress {
  completedLevelIds?: ReadonlySet<string>;
  unlockedLevelIds?: ReadonlySet<string>;
}

export interface LearningPathStop {
  destinationId: string;
  label: string;
  icon: string;
  state: 'current' | 'locked' | 'completed';
}

export type LearningPathView =
  | { status: 'empty'; stops: [] }
  | {
      status: 'ready';
      courseLabel: string;
      courseIcon: string;
      stops: LearningPathStop[];
    };

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
    stops: levels.map((level, index) => ({
      destinationId: level.id,
      label: level.presentation!.label,
      icon: level.presentation!.icon,
      state: completed.has(level.id)
        ? 'completed'
        : explicitUnlocked?.has(level.id) || (!explicitUnlocked && index === 0)
          ? 'current'
          : 'locked',
    })),
  };
}
