export type HintLevel = 1 | 2 | 3;

export interface ActivityHint {
  level: HintLevel;
  visualCue: string;
  spokenCue?: string;
}

export interface HintContent {
  hints: readonly [ActivityHint, ActivityHint, ActivityHint];
}

export function hintForAttempt(
  content: HintContent,
  incorrectAttempt: number,
): ActivityHint | null {
  if (!Number.isInteger(incorrectAttempt) || incorrectAttempt < 1) return null;
  const level = Math.min(incorrectAttempt, 3) as HintLevel;
  const hint = content.hints[level - 1]!;
  if (hint.level !== level)
    throw new Error('As dicas devem estar ordenadas nos níveis 1, 2 e 3.');
  if (!hint.visualCue.trim())
    throw new Error('Toda dica precisa de uma alternativa visual.');
  return { ...hint };
}
