import { z } from 'zod';
export const progressStateSchema = z.enum([
  'locked',
  'available',
  'inProgress',
  'completed',
]);
const nodeProgressSchema = z
  .object({
    state: progressStateSchema,
    completedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict()
  .refine((node) => node.state === 'completed' || !node.completedAt, {
    message: 'completedAt exige estado completed',
  });
const activityProgressSchema = nodeProgressSchema.extend({
  attempts: z.number().int().nonnegative(),
  bestStars: z.number().int().min(0).max(3),
});
export const progressSnapshotSchema = z
  .object({
    schemaVersion: z.literal(1),
    profileId: z.string().regex(/^profile_[0-9a-f-]{36}$/i),
    activities: z.record(
      z.string().regex(/^activity\./),
      activityProgressSchema,
    ),
    levels: z.record(z.string().regex(/^level\./), nodeProgressSchema),
    skills: z.record(z.string().regex(/^skill\./), nodeProgressSchema),
    trails: z.record(z.string().regex(/^trail\./), nodeProgressSchema),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .strict();
export type ProgressState = z.infer<typeof progressStateSchema>;
export type ProgressSnapshot = z.infer<typeof progressSnapshotSchema>;
export function createEmptyProgress(
  profileId: string,
  updatedAt: string,
): ProgressSnapshot {
  return progressSnapshotSchema.parse({
    schemaVersion: 1,
    profileId,
    activities: {},
    levels: {},
    skills: {},
    trails: {},
    updatedAt,
  });
}
