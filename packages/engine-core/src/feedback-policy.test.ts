import { describe, expect, it } from 'vitest';
import { feedbackForAttempt } from './feedback-policy';

describe('feedbackForAttempt', () => {
  it('emite acerto com som, animação e sem bloquear fluxo', () => {
    expect(feedbackForAttempt(true, 1)).toEqual({
      kind: 'correct',
      soundCueId: 'sfx.correct',
      visual: 'celebrate',
      blocksFlow: false,
    });
  });

  it.each([
    [1, 1, 'retry'],
    [2, 2, 'highlight'],
    [3, 3, 'demonstrate'],
    [4, 3, 'demonstrate'],
  ] as const)(
    'tentativa %s usa dica %s e ação %s',
    (attempt, level, visual) => {
      expect(feedbackForAttempt(false, attempt)).toMatchObject({
        hintLevel: level,
        visual,
        blocksFlow: false,
      });
    },
  );
});
