import {
  createEmptyProgress,
  progressSnapshotSchema,
  type ProgressSnapshot,
} from './progress';

export interface CompleteActivityInput {
  profileId: string;
  activityId: string;
  attempts: number;
  stars: number;
  completedAt: string;
}

export interface ProgressRepository {
  get(profileId: string): Promise<ProgressSnapshot | null>;
  save(snapshot: ProgressSnapshot): Promise<void>;
}

function cloneSnapshot(snapshot: ProgressSnapshot): ProgressSnapshot {
  return progressSnapshotSchema.parse(JSON.parse(JSON.stringify(snapshot)));
}

export class InMemoryProgressRepository implements ProgressRepository {
  readonly #records = new Map<string, ProgressSnapshot>();

  async get(profileId: string): Promise<ProgressSnapshot | null> {
    const snapshot = this.#records.get(profileId);
    return snapshot ? cloneSnapshot(snapshot) : null;
  }

  async save(snapshot: ProgressSnapshot): Promise<void> {
    const valid = progressSnapshotSchema.parse(snapshot);
    this.#records.set(valid.profileId, cloneSnapshot(valid));
  }
}

export async function completeActivity(
  repository: ProgressRepository,
  input: CompleteActivityInput,
): Promise<ProgressSnapshot> {
  const current =
    (await repository.get(input.profileId)) ??
    createEmptyProgress(input.profileId, input.completedAt);
  const previous = current.activities[input.activityId];
  const next = progressSnapshotSchema.parse({
    ...current,
    activities: {
      ...current.activities,
      [input.activityId]: {
        state: 'completed',
        completedAt: previous?.completedAt ?? input.completedAt,
        attempts: previous?.attempts ?? input.attempts,
        bestStars: Math.max(previous?.bestStars ?? 0, input.stars),
      },
    },
    updatedAt: previous ? current.updatedAt : input.completedAt,
  });
  await repository.save(next);
  return next;
}
