import { describe, expect, it } from 'vitest';
import { feedbackCopyCatalog } from './feedback-copy';

function phrases(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(phrases);
}

describe('feedbackCopyCatalog', () => {
  it('centraliza frases curtas para mascote, tentativas e conclusão', () => {
    expect(Object.keys(feedbackCopyCatalog)).toEqual([
      'mascot',
      'attempts',
      'completion',
    ]);
    expect(
      phrases(feedbackCopyCatalog).every((phrase) => phrase.length <= 64),
    ).toBe(true);
  });

  it('não usa culpa, comparação, urgência ou rótulo de erro', () => {
    const copy = phrases(feedbackCopyCatalog)
      .join(' ')
      .toLocaleLowerCase('pt-BR');
    for (const banned of [
      'você errou',
      'resposta incorreta',
      'rápido',
      'perdeu',
      'melhor que',
      'pior que',
    ])
      expect(copy).not.toContain(banned);
  });
});
