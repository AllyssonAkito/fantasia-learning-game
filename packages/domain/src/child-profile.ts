import { z } from 'zod';

const childProfileIdPattern =
  /^profile_[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const responsibleIdPattern =
  /^responsible_[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const childProfileSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().regex(childProfileIdPattern),
    responsibleId: z.string().regex(responsibleIdPattern),
    displayName: z.string().trim().min(1).max(30),
    ageBand: z.enum(['3-4', '4-5', '5-6', '6-7']),
    avatarId: z.string().regex(/^avatar\.[a-z0-9]+(?:-[a-z0-9]+)*$/),
    preferences: z
      .object({
        narrationEnabled: z.boolean(),
        soundEffectsEnabled: z.boolean(),
        reducedMotion: z.boolean(),
      })
      .strict(),
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
    archivedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict()
  .refine((profile) => profile.updatedAt >= profile.createdAt, {
    message: 'updatedAt não pode ser anterior a createdAt',
    path: ['updatedAt'],
  })
  .refine(
    (profile) => !profile.archivedAt || profile.archivedAt >= profile.createdAt,
    {
      message: 'archivedAt não pode ser anterior a createdAt',
      path: ['archivedAt'],
    },
  );

export type ChildProfile = z.infer<typeof childProfileSchema>;
