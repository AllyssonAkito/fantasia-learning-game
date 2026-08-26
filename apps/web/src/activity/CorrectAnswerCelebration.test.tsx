import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CorrectAnswerCelebration } from './CorrectAnswerCelebration';

describe('CorrectAnswerCelebration', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('isola a resposta, bloqueia a rolagem e conclui após crescer', () => {
    vi.useFakeTimers();
    const onFinished = vi.fn();
    const { container, unmount } = render(
      <CorrectAnswerCelebration
        assetId="asset.symbol.carrot"
        label="cenoura"
        onFinished={onFinished}
        origin={{ height: 120, left: 30, top: 40, width: 140 }}
      />,
    );

    expect(screen.getByRole('status')).toHaveAccessibleName(
      'Muito bem! cenoura é a resposta.',
    );
    expect(document.body.style.overflow).toBe('hidden');
    const visual = container.querySelector(
      '.correct-answer-celebration__visual',
    )!;
    expect(visual).toHaveAttribute('data-asset-id', 'asset.symbol.carrot');
    expect(visual.querySelector('img')).toHaveAttribute(
      'src',
      '/assets/activity/carrot.webp',
    );
    act(() => vi.advanceTimersByTime(1100));
    expect(onFinished).toHaveBeenCalledOnce();

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('encurta a espera quando movimento reduzido está ativo', () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const onFinished = vi.fn();
    const { container } = render(
      <CorrectAnswerCelebration
        assetId="asset.symbol.ball"
        label="bola"
        onFinished={onFinished}
      />,
    );

    expect(
      container.querySelector('.correct-answer-celebration__visual'),
    ).toHaveAttribute('data-duration-ms', '80');
    act(() => vi.advanceTimersByTime(80));
    expect(onFinished).toHaveBeenCalledOnce();
  });
});
