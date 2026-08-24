import { describe, expect, it } from 'vitest';
import { hintForAttempt, type HintContent } from './hint-service';

const content: HintContent = {
  hints: [
    { level: 1, visualCue: 'Tente mais uma vez.' },
    {
      level: 2,
      visualCue: 'Olhe a parte destacada.',
      spokenCue: 'Veja a luz.',
    },
    { level: 3, visualCue: 'Escolha entre estas duas opções.' },
  ],
};

describe('hintForAttempt', () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 3],
  ])('usa tentativa %s para a dica %s', (attempt, level) => {
    expect(hintForAttempt(content, attempt)?.level).toBe(level);
  });

  it('não mostra dica antes de um erro', () => {
    expect(hintForAttempt(content, 0)).toBeNull();
  });

  it('exige fallback visual e ordem segura', () => {
    expect(() =>
      hintForAttempt(
        {
          hints: [
            { level: 2, visualCue: 'fora de ordem' },
            { level: 1, visualCue: 'fora de ordem' },
            { level: 3, visualCue: 'ok' },
          ],
        },
        1,
      ),
    ).toThrow('ordenadas');
  });
});
