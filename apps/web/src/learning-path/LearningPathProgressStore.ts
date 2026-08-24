import type { LearningPathProgress } from '@fantasia/content';

export interface ActivityLearningPathProgress extends LearningPathProgress {
  completedActivityIds?: ReadonlySet<string>;
}

export class LearningPathProgressStore {
  readonly #listeners = new Set<() => void>();
  #snapshot: ActivityLearningPathProgress = {};

  getSnapshot = (): ActivityLearningPathProgress => this.#snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  completeActivity(
    activityId: string,
    levelId: string,
    levelActivityIds: readonly string[],
    nextLevelId?: string,
  ): boolean {
    const completedActivityIds = new Set([
      ...(this.#snapshot.completedActivityIds ?? []),
      activityId,
    ]);
    const levelComplete = levelActivityIds.every((id) =>
      completedActivityIds.has(id),
    );

    this.#snapshot = {
      ...this.#snapshot,
      completedActivityIds,
      completedLevelIds: levelComplete
        ? new Set([...(this.#snapshot.completedLevelIds ?? []), levelId])
        : this.#snapshot.completedLevelIds,
      unlockedLevelIds:
        levelComplete && nextLevelId
          ? new Set([...(this.#snapshot.unlockedLevelIds ?? []), nextLevelId])
          : this.#snapshot.unlockedLevelIds,
    };
    this.emit();
    return levelComplete;
  }

  completeLevel(levelId: string, nextLevelId?: string): void {
    this.#snapshot = {
      completedLevelIds: new Set([
        ...(this.#snapshot.completedLevelIds ?? []),
        levelId,
      ]),
      unlockedLevelIds: new Set([
        ...(this.#snapshot.unlockedLevelIds ?? []),
        ...(nextLevelId ? [nextLevelId] : []),
      ]),
    };
    this.emit();
  }

  private emit() {
    for (const listener of this.#listeners) listener();
  }
}
