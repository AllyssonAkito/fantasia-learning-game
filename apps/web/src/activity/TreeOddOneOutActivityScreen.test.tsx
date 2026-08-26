import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { mvpCatalogSeed } from '@fantasia/content';
import { createChoicePresentation } from './activity-presentation';
import { TreeOddOneOutActivityScreen } from './TreeOddOneOutActivityScreen';

const activity = mvpCatalogSeed.activities!.find(
  ({ id }) => id === 'activity.logic.odd-one-out.001',
)!;

function audioService() {
  return {
    repeatInstruction: vi.fn(async () => 'tts' as const),
    playEffect: vi.fn(async () => true),
  } as unknown as AudioService;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('TreeOddOneOutActivityScreen', () => {
  it('faz as quatro árvores surgirem em sequência com efeito sonoro', () => {
    vi.useFakeTimers();
    const audio = audioService();
    const { container } = render(
      <TreeOddOneOutActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    const pieces = container.querySelectorAll(
      '.tree-odd-one-out__pieces button',
    );
    expect(pieces).toHaveLength(4);
    expect(container.querySelectorAll('[data-visible="true"]')).toHaveLength(0);

    act(() => vi.advanceTimersByTime(260));
    expect(container.querySelectorAll('[data-visible="true"]')).toHaveLength(1);
    act(() => vi.advanceTimersByTime(780));
    expect(container.querySelectorAll('[data-visible="true"]')).toHaveLength(4);
    expect(container.querySelector('.tree-odd-one-out')).toHaveAttribute(
      'data-phase',
      'ready',
    );
    expect(
      (audio.playEffect as ReturnType<typeof vi.fn>).mock.calls.filter(
        ([effect]) => effect === 'reveal',
      ),
    ).toHaveLength(4);
    expect(container.querySelectorAll('.activity-sprite-image')).toHaveLength(
      4,
    );
  });

  it('treme todas as peças e toca um grave gentil após uma escolha diferente', () => {
    vi.useFakeTimers();
    const audio = audioService();
    const { container } = render(
      <TreeOddOneOutActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    act(() => vi.advanceTimersByTime(1040));
    const presentation = createChoicePresentation(activity);
    const wrong = presentation.options.find(
      ({ id }) => !presentation.evaluate(id),
    )!;

    fireEvent.click(screen.getByRole('button', { name: wrong.label }));
    expect(container.querySelector('.tree-odd-one-out')).toHaveAttribute(
      'data-phase',
      'wrong',
    );
    expect(audio.playEffect).toHaveBeenCalledWith('wrong-rumble');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Vamos tentar de novo.',
    );
    act(() => vi.advanceTimersByTime(520));
    expect(container.querySelector('.tree-odd-one-out')).toHaveAttribute(
      'data-phase',
      'ready',
    );
  });

  it('isola o cachorrinho, faz crescer, brincar, esconder e só então recompensa', () => {
    vi.useFakeTimers();
    const audio = audioService();
    const onComplete = vi.fn();
    const { container } = render(
      <TreeOddOneOutActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={onComplete}
      />,
    );
    act(() => vi.advanceTimersByTime(1040));
    const presentation = createChoicePresentation(activity);
    const correct = presentation.options.find(({ id }) =>
      presentation.evaluate(id),
    )!;

    fireEvent.click(screen.getByRole('button', { name: correct.label }));
    expect(
      screen.getByRole('status', { name: /cresce, brinca/i }),
    ).toHaveAttribute('data-phase', 'growing');
    expect(container.querySelectorAll('[data-dismissing="true"]')).toHaveLength(
      3,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(850));
    expect(
      screen.getByRole('status', { name: /cresce, brinca/i }),
    ).toHaveAttribute('data-phase', 'celebrating');
    act(() => vi.advanceTimersByTime(560));
    expect(
      screen.getByRole('status', { name: /cresce, brinca/i }),
    ).toHaveAttribute('data-phase', 'hiding');
    expect(container.querySelector('.tree-success__cover')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(680));

    const dialog = screen.getByRole('dialog', { name: 'Você conseguiu!' });
    expect(dialog).toBeVisible();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Continuar' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('encurta todas as transições quando a pessoa prefere menos movimento', () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const audio = audioService();
    render(
      <TreeOddOneOutActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    act(() => vi.advanceTimersByTime(80));
    const presentation = createChoicePresentation(activity);
    const correct = presentation.options.find(({ id }) =>
      presentation.evaluate(id),
    )!;
    fireEvent.click(screen.getByRole('button', { name: correct.label }));
    act(() => vi.advanceTimersByTime(200));
    expect(
      screen.getByRole('dialog', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });
});
