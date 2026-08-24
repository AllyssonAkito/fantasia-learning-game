import type { HintLevel } from './hint-service';

export type FeedbackVisual =
  'celebrate' | 'retry' | 'highlight' | 'demonstrate';

export interface FeedbackCue {
  kind: 'correct' | 'incorrect';
  soundCueId: 'sfx.correct' | 'sfx.try-again';
  visual: FeedbackVisual;
  hintLevel?: HintLevel;
  blocksFlow: false;
}

export function feedbackForAttempt(
  correct: boolean,
  attempt: number,
): FeedbackCue {
  if (correct)
    return {
      kind: 'correct',
      soundCueId: 'sfx.correct',
      visual: 'celebrate',
      blocksFlow: false,
    };
  if (!Number.isInteger(attempt) || attempt < 1)
    throw new Error('Feedback de tentativa exige tentativa positiva.');
  const hintLevel = Math.min(attempt, 3) as HintLevel;
  return {
    kind: 'incorrect',
    soundCueId: 'sfx.try-again',
    visual: (['retry', 'highlight', 'demonstrate'] as const)[hintLevel - 1]!,
    hintLevel,
    blocksFlow: false,
  };
}
