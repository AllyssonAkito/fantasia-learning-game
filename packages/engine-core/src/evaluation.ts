export type EvaluationOutcome = 'correct' | 'incorrect';

export type EvaluationMetadata = Readonly<Record<string, unknown>>;

export interface EvaluationResult {
  correct: boolean;
  outcome: EvaluationOutcome;
  metadata: EvaluationMetadata;
}

export function createEvaluation(
  correct: boolean,
  metadata: EvaluationMetadata = {},
): EvaluationResult {
  return Object.freeze({
    correct,
    outcome: correct ? 'correct' : 'incorrect',
    metadata: Object.freeze({ ...metadata }),
  });
}
