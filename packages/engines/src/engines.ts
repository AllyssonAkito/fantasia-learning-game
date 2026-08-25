import {
  createEvaluation,
  difficultySettings,
  type ActivityEngine,
  type EngineRegistry,
  type EvaluationResult,
} from '@fantasia/engine-core';
import { z } from 'zod';

const id = z.string().min(1);
const difficulty = z.number().int().min(1).max(10);
const option = z.object({ id, label: z.string().min(1) }).strict();
const visualClue = z
  .object({
    assetId: id,
    focusX: z.enum(['left', 'center', 'right']),
    focusY: z.enum(['top', 'center', 'bottom']),
  })
  .strict();
const base = z.object({ difficulty, prompt: z.string().min(1) });

function parseAndEvaluate<Definition, Answer>(
  schema: z.ZodType<Definition>,
  definition: Definition,
  answer: Answer,
  check: (valid: Definition, answer: Answer) => boolean,
  metadata: Record<string, unknown> = {},
): EvaluationResult {
  const valid = schema.parse(definition);
  return createEvaluation(check(valid, answer), {
    difficultyBand: difficultySettings(
      (valid as { difficulty: number }).difficulty,
    ).band,
    ...metadata,
  });
}

export const choiceDefinitionSchema = base
  .extend({
    options: z.array(option).min(2).max(4),
    correctOptionId: id,
    clue: visualClue.optional(),
  })
  .strict()
  .refine(
    (value) => value.options.some((item) => item.id === value.correctOptionId),
    {
      message: 'A resposta correta deve existir nas opções.',
    },
  );
export type ChoiceDefinition = z.infer<typeof choiceDefinitionSchema>;
export const choiceEngine: ActivityEngine<ChoiceDefinition, string> = {
  id: 'choice',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      choiceDefinitionSchema,
      definition,
      answer,
      (valid, given) => valid.correctOptionId === given,
    ),
};

export const dragDefinitionSchema = base
  .extend({
    items: z.array(z.object({ id, targetId: id }).strict()).min(1),
    targets: z.array(option).min(1),
  })
  .strict()
  .refine(
    (value) =>
      value.items.every((item) =>
        value.targets.some((target) => target.id === item.targetId),
      ),
    { message: 'Todo item precisa de um destino válido.' },
  );
export type DragDefinition = z.infer<typeof dragDefinitionSchema>;
export interface PlacementAnswer {
  interaction: 'drag' | 'select';
  placements: Record<string, string>;
}
export const dragEngine: ActivityEngine<DragDefinition, PlacementAnswer> = {
  id: 'drag',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      dragDefinitionSchema,
      definition,
      answer,
      (valid, given) =>
        valid.items.every(
          (item) => given.placements[item.id] === item.targetId,
        ),
      { interaction: answer.interaction },
    ),
};

export const sequenceDefinitionSchema = base
  .extend({
    pattern: z.array(id).min(2),
    options: z.array(option).min(2).max(4),
    expectedId: id,
  })
  .strict();
export type SequenceDefinition = z.infer<typeof sequenceDefinitionSchema>;
export const sequenceEngine: ActivityEngine<SequenceDefinition, string> = {
  id: 'sequence',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      sequenceDefinitionSchema,
      definition,
      answer,
      (valid, given) => valid.expectedId === given,
    ),
};

export const associationDefinitionSchema = base
  .extend({
    mode: z.enum(['one-to-one', 'category']),
    relations: z.record(id, id),
  })
  .strict();
export type AssociationDefinition = z.infer<typeof associationDefinitionSchema>;
export const associationEngine: ActivityEngine<
  AssociationDefinition,
  Record<string, string>
> = {
  id: 'association',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      associationDefinitionSchema,
      definition,
      answer,
      (valid, given) =>
        Object.entries(valid.relations).every(
          ([itemId, targetId]) => given[itemId] === targetId,
        ),
    ),
};

export const classificationDefinitionSchema = base
  .extend({
    groups: z.array(option).min(2).max(4),
    assignments: z.record(id, id),
  })
  .strict();
export type ClassificationDefinition = z.infer<
  typeof classificationDefinitionSchema
>;
export const classificationEngine: ActivityEngine<
  ClassificationDefinition,
  Record<string, string>
> = {
  id: 'classification',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      classificationDefinitionSchema,
      definition,
      answer,
      (valid, given) =>
        Object.entries(valid.assignments).every(
          ([itemId, groupId]) => given[itemId] === groupId,
        ),
    ),
};

export const memoryDefinitionSchema = base
  .extend({
    mode: z.enum(['pairs', 'sequence', 'positions']),
    expected: z.array(id).min(2),
    revealMs: z.number().int().positive().max(10_000),
  })
  .strict();
export type MemoryDefinition = z.infer<typeof memoryDefinitionSchema>;
export const memoryEngine: ActivityEngine<MemoryDefinition, string[]> = {
  id: 'memory',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      memoryDefinitionSchema,
      definition,
      answer,
      (valid, given) => valid.expected.join('|') === given.join('|'),
      { hidesAfterMs: definition.revealMs },
    ),
};

export const comparisonDefinitionSchema = base
  .extend({
    dimension: z.enum(['quantity', 'size']),
    candidates: z
      .array(z.object({ id, value: z.number() }).strict())
      .min(2)
      .max(4),
    expectedId: id,
  })
  .strict();
export type ComparisonDefinition = z.infer<typeof comparisonDefinitionSchema>;
export const comparisonEngine: ActivityEngine<ComparisonDefinition, string> = {
  id: 'comparison',
  evaluate: (definition, answer) =>
    parseAndEvaluate(
      comparisonDefinitionSchema,
      definition,
      answer,
      (valid, given) => valid.expectedId === given,
    ),
};

export const assemblyDefinitionSchema = base
  .extend({
    pieces: z
      .array(
        z
          .object({ id, slotId: id, order: z.number().int().nonnegative() })
          .strict(),
      )
      .min(2),
    snapTolerance: z.number().positive(),
    resetOnIncorrect: z.literal(true),
  })
  .strict();
export type AssemblyDefinition = z.infer<typeof assemblyDefinitionSchema>;
export interface AssemblyAnswer {
  placements: Record<string, string>;
  order: string[];
}
export const assemblyEngine: ActivityEngine<
  AssemblyDefinition,
  AssemblyAnswer
> = {
  id: 'assembly',
  evaluate: (definition, answer) => {
    const result = parseAndEvaluate(
      assemblyDefinitionSchema,
      definition,
      answer,
      (valid, given) => {
        const ordered = [...valid.pieces].sort((a, b) => a.order - b.order);
        return ordered.every(
          (piece, index) =>
            given.placements[piece.id] === piece.slotId &&
            given.order[index] === piece.id,
        );
      },
    );
    return createEvaluation(result.correct, {
      ...result.metadata,
      resetPieces: !result.correct,
      snapTolerance: definition.snapTolerance,
    });
  },
};

export const allEngines = [
  choiceEngine,
  dragEngine,
  sequenceEngine,
  associationEngine,
  classificationEngine,
  memoryEngine,
  comparisonEngine,
  assemblyEngine,
] as const;

export const engineDefinitionSchemas = {
  choice: choiceDefinitionSchema,
  drag: dragDefinitionSchema,
  sequence: sequenceDefinitionSchema,
  association: associationDefinitionSchema,
  classification: classificationDefinitionSchema,
  memory: memoryDefinitionSchema,
  comparison: comparisonDefinitionSchema,
  assembly: assemblyDefinitionSchema,
} as const;

export function registerAllEngines(registry: EngineRegistry): EngineRegistry {
  for (const engine of allEngines) registry.register(engine as ActivityEngine);
  return registry;
}
