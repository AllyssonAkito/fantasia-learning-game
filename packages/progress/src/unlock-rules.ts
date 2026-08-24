import { progressSnapshotSchema, type ProgressSnapshot } from './progress';

export interface UnlockRule {
  targetLevelId: string;
  requiredActivityIds: readonly string[];
}

export function applyUnlockRules(
  snapshot: ProgressSnapshot,
  rules: readonly UnlockRule[],
): ProgressSnapshot {
  const levels = { ...snapshot.levels };
  for (const rule of rules) {
    const unlocked =
      rule.requiredActivityIds.length > 0 &&
      rule.requiredActivityIds.every(
        (activityId) => snapshot.activities[activityId]?.state === 'completed',
      );
    if (unlocked && levels[rule.targetLevelId]?.state !== 'completed')
      levels[rule.targetLevelId] = { state: 'available' };
  }
  return progressSnapshotSchema.parse({ ...snapshot, levels });
}
