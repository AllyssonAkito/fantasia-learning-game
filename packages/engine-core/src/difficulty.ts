export type DifficultyBand =
  'intro' | 'guided' | 'practice' | 'challenge' | 'mastery';

export interface DifficultySettings {
  value: number;
  band: DifficultyBand;
  hintDelayMultiplier: number;
  distractorPressure: number;
}

export function difficultySettings(value: number): DifficultySettings {
  if (!Number.isInteger(value) || value < 1 || value > 10)
    throw new Error('A dificuldade deve ser um número inteiro de 1 a 10.');
  const bands: DifficultyBand[] = [
    'intro',
    'guided',
    'practice',
    'challenge',
    'mastery',
  ];
  return {
    value,
    band: bands[Math.floor((value - 1) / 2)] as DifficultyBand,
    hintDelayMultiplier: 0.8 + (value - 1) * 0.08,
    distractorPressure: Math.floor((value - 1) / 2),
  };
}
