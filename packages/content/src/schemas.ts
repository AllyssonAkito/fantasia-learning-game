import { z } from 'zod';

export const editorialStatusSchema = z.enum([
  'draft',
  'review',
  'published',
  'retired',
]);

export const engineIdSchema = z.enum([
  'choice',
  'drag',
  'sequence',
  'association',
  'classification',
  'memory',
  'comparison',
  'assembly',
]);

const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const idSegmentPattern = '[a-z0-9]+(?:-[a-z0-9]+)*';

function entityId(prefix: string, segments: number) {
  return z
    .string()
    .regex(
      new RegExp(`^${prefix}(?:\\.${idSegmentPattern}){${segments}}$`),
      `ID deve seguir o formato ${prefix} com ${segments} segmento(s)`,
    );
}

const commonFields = {
  schemaVersion: z.number().int().positive(),
  contentVersion: z.string().regex(semverPattern),
  status: editorialStatusSchema,
  title: z.string().trim().min(1).max(120),
  order: z.number().int().nonnegative(),
};

const childPresentationSchema = z
  .object({
    label: z.string().trim().min(1).max(40),
    icon: z.string().regex(/^icon\.[a-z0-9]+(?:-[a-z0-9]+)*$/),
  })
  .strict();

export const courseSchema = z
  .object({
    ...commonFields,
    id: entityId('course', 1),
    presentation: childPresentationSchema.optional(),
  })
  .strict();

export const trailSchema = z
  .object({
    ...commonFields,
    id: entityId('trail', 2),
    courseId: entityId('course', 1),
    presentation: childPresentationSchema.optional(),
  })
  .strict();

export const skillSchema = z
  .object({
    ...commonFields,
    id: entityId('skill', 2),
    trailId: entityId('trail', 2),
  })
  .strict();

export const levelSchema = z
  .object({
    ...commonFields,
    id: entityId('level', 3),
    skillId: entityId('skill', 2),
    difficulty: z.number().int().min(1).max(10),
    presentation: childPresentationSchema.optional(),
  })
  .strict();

const instructionSchema = z
  .object({
    text: z.string().trim().min(1).max(180),
    audio: z.string().trim().min(1).optional(),
    ttsFallback: z.boolean().default(true),
  })
  .strict()
  .refine((instruction) => instruction.audio || instruction.ttsFallback, {
    message: 'A instrução precisa de áudio ou fallback TTS',
  });

export const activitySchema = z
  .object({
    ...commonFields,
    id: entityId('activity', 3),
    levelId: entityId('level', 3),
    engine: engineIdSchema,
    difficulty: z.number().int().min(1).max(10),
    instruction: instructionSchema,
    content: z.record(z.string(), z.unknown()),
    hints: z
      .array(
        z
          .object({
            type: z.string().trim().min(1),
            payload: z.record(z.string(), z.unknown()).optional(),
          })
          .strict(),
      )
      .max(3),
    reward: z
      .object({
        stars: z.number().int().nonnegative(),
        coins: z.number().int().nonnegative(),
      })
      .strict(),
    assets: z.array(z.string().trim().min(1)),
  })
  .strict();

export type EditorialStatus = z.infer<typeof editorialStatusSchema>;
export type EngineId = z.infer<typeof engineIdSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Trail = z.infer<typeof trailSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Activity = z.infer<typeof activitySchema>;
