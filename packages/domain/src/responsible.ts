import { z } from 'zod';

const responsibleIdPattern =
  /^responsible_[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const responsibleSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().regex(responsibleIdPattern),
    displayName: z.string().trim().min(1).max(40).optional(),
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .strict()
  .refine((account) => account.updatedAt >= account.createdAt, {
    message: 'updatedAt não pode ser anterior a createdAt',
    path: ['updatedAt'],
  });

export type Responsible = z.infer<typeof responsibleSchema>;
