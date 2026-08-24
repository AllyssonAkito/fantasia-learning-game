import type { LearningPathProgress } from '@fantasia/content';

export class LearningPathProgressStore {
  readonly #listeners = new Set<() => void>();
  #snapshot: LearningPathProgress = {};

  getSnapshot = (): LearningPathProgress => this.#snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

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
    for (const listener of this.#listeners) listener();
  }
}
