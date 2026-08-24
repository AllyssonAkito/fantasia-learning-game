import { describe, expect, it } from 'vitest';

import {
  activitySchema,
  courseSchema,
  levelSchema,
  skillSchema,
  trailSchema,
} from './schemas';

const common = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  status: 'draft',
  title: 'Título interno',
  order: 0,
} as const;

const examples = {
  course: {
    schema: courseSchema,
    valid: { ...common, id: 'course.logic' },
  },
  trail: {
    schema: trailSchema,
    valid: {
      ...common,
      id: 'trail.logic.patterns',
      courseId: 'course.logic',
    },
  },
  skill: {
    schema: skillSchema,
    valid: {
      ...common,
      id: 'skill.logic.repeat-pattern',
      trailId: 'trail.logic.patterns',
    },
  },
  level: {
    schema: levelSchema,
    valid: {
      ...common,
      id: 'level.logic.patterns.01',
      skillId: 'skill.logic.repeat-pattern',
      difficulty: 2,
    },
  },
  activity: {
    schema: activitySchema,
    valid: {
      ...common,
      id: 'activity.logic.repeat.001',
      levelId: 'level.logic.patterns.01',
      engine: 'sequence',
      difficulty: 2,
      instruction: {
        text: 'O que vem depois?',
        audio: 'audio/instructions/what-next.mp3',
        ttsFallback: true,
      },
      content: { options: ['circle', 'square'] },
      hints: [{ type: 'highlight-pattern' }],
      reward: { stars: 1, coins: 2 },
      assets: ['shape.circle', 'shape.square'],
    },
  },
} as const;

describe('schemas de conteúdo', () => {
  it.each(Object.entries(examples))('aceita um %s válido', (_name, example) => {
    expect(example.schema.safeParse(example.valid).success).toBe(true);
  });

  it.each(Object.entries(examples))(
    'recusa um %s com campo não aprovado',
    (_name, example) => {
      expect(
        example.schema.safeParse({ ...example.valid, childName: 'Melina' })
          .success,
      ).toBe(false);
    },
  );

  it('recusa atividade sem áudio e sem fallback visual/sonoro', () => {
    const activity = examples.activity.valid;

    expect(
      activitySchema.safeParse({
        ...activity,
        instruction: {
          text: activity.instruction.text,
          ttsFallback: false,
        },
      }).success,
    ).toBe(false);
  });

  it('recusa IDs, versões e dificuldade fora do contrato', () => {
    expect(
      levelSchema.safeParse({
        ...examples.level.valid,
        id: 'Nível da Melina',
        contentVersion: 'v1',
        difficulty: 11,
      }).success,
    ).toBe(false);
  });
});
