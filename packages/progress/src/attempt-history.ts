import { z } from 'zod';

export const attemptRecordSchema = z
  .object({
    sessionId: z.string().min(1),
    profileId: z.string().regex(/^profile_[0-9a-f-]{36}$/i),
    activityId: z.string().regex(/^activity\./),
    elapsedMs: z.number().int().nonnegative(),
    attempts: z.number().int().positive(),
    hintsUsed: z.number().int().min(0).max(3),
    result: z.enum(['completed', 'abandoned']),
    occurredAt: z.iso.datetime({ offset: true }),
  })
  .strict();
export type AttemptRecord = z.infer<typeof attemptRecordSchema>;

export class AttemptHistory {
  readonly #records: AttemptRecord[] = [];

  add(record: AttemptRecord): AttemptRecord {
    const valid = attemptRecordSchema.parse(record);
    if (!this.#records.some((item) => item.sessionId === valid.sessionId))
      this.#records.push(valid);
    return { ...valid };
  }

  forProfile(profileId: string): AttemptRecord[] {
    return this.#records
      .filter((record) => record.profileId === profileId)
      .map((record) => ({ ...record }));
  }
}
