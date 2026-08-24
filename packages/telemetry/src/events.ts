import { z } from 'zod';

export const telemetryEventNames = [
  'session_started',
  'trail_opened',
  'activity_started',
  'answer_submitted',
  'hint_shown',
  'activity_completed',
  'activity_abandoned',
  'reward_granted',
  'audio_repeated',
  'runtime_error',
] as const;

export type TelemetryEventName = (typeof telemetryEventNames)[number];

const activityId = z
  .string()
  .regex(/^activity\.[a-z0-9-]+\.[a-z0-9-]+\.\d{3}$/);
const pseudonymousId = z
  .string()
  .regex(/^(session|profile)_[a-zA-Z0-9-]{6,64}$/);

export const telemetryEventSchema = z
  .object({
    event: z.enum(telemetryEventNames),
    eventVersion: z.literal(1),
    occurredAt: z.string().datetime(),
    sessionId: pseudonymousId.refine((value) => value.startsWith('session_')),
    childProfileId: pseudonymousId.refine((value) =>
      value.startsWith('profile_'),
    ),
    activityId: activityId.optional(),
    activityVersion: z.number().int().positive().optional(),
    engine: z
      .enum([
        'choice',
        'drag',
        'sequence',
        'association',
        'classification',
        'memory',
        'comparison',
        'assembly',
      ])
      .optional(),
    difficulty: z.number().int().min(1).max(10).optional(),
    attempt: z.number().int().positive().optional(),
    hintLevel: z.number().int().min(1).max(3).optional(),
    elapsedMs: z.number().int().nonnegative().optional(),
    result: z.enum(['correct', 'incorrect']).optional(),
    stars: z.number().int().nonnegative().optional(),
    coins: z.number().int().nonnegative().optional(),
    technicalCode: z
      .enum(['audio-unavailable', 'content-invalid', 'runtime-recovered'])
      .optional(),
  })
  .strict()
  .superRefine((event, context) => {
    const activityEvents: readonly TelemetryEventName[] = [
      'activity_started',
      'answer_submitted',
      'hint_shown',
      'activity_completed',
      'activity_abandoned',
      'reward_granted',
      'audio_repeated',
    ];
    if (
      activityEvents.includes(event.event) &&
      (!event.activityId || !event.engine || !event.difficulty)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Evento de atividade exige activityId, engine e difficulty.',
      });
    }
    if (
      event.event === 'answer_submitted' &&
      (!event.attempt || !event.result)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Resposta exige tentativa e resultado.',
      });
    }
    if (event.event === 'hint_shown' && !event.hintLevel) {
      context.addIssue({ code: 'custom', message: 'Dica exige nível.' });
    }
    if (event.event === 'runtime_error' && !event.technicalCode) {
      context.addIssue({
        code: 'custom',
        message: 'Erro exige código técnico permitido.',
      });
    }
  });

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;

export function parseTelemetryEvent(candidate: unknown): TelemetryEvent {
  return telemetryEventSchema.parse(candidate);
}
