import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { mvpCatalogSeed } from '@fantasia/content';
import { ActivityScreen } from './ActivityScreen';
import { createChoicePresentation } from './activity-presentation';

const activity = mvpCatalogSeed.activities![0]!;
const audio = {
  repeatInstruction: vi.fn(async () => 'visual-only' as const),
  playEffect: vi.fn(async () => true),
} as unknown as AudioService;

describe('ActivityScreen', () => {
  it('adapta conteúdo validado sem duplicar resposta na tela', () => {
    const presentation = createChoicePresentation(activity);
    expect(presentation.options).toHaveLength(3);
    expect(
      presentation.options.some(({ id }) => presentation.evaluate(id)),
    ).toBe(true);
  });

  it('mostra somente personagens nas escolhas e inicia o áudio', async () => {
    render(
      <ActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    const presentation = createChoicePresentation(activity);
    for (const option of presentation.options) {
      const button = screen.getByRole('button', { name: option.label });
      expect(button).toHaveTextContent('');
      expect(button.querySelector('img')).toHaveAttribute(
        'src',
        expect.stringMatching(/\/assets\/activity\/.+\.webp$/),
      );
    }
    expect(screen.queryByText(/brincadeira \d+/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: activity.instruction.text }),
    ).toHaveClass('visually-hidden');
    expect(screen.getByRole('button', { name: 'Voltar' })).toHaveTextContent(
      '×',
    );
    expect(
      screen.getByRole('button', { name: 'Ouvir a instrução novamente' }),
    ).toHaveTextContent('');
    await waitFor(() => expect(audio.repeatInstruction).toHaveBeenCalled());
  });

  it('oferece nova tentativa, dica e conclusão em modal', () => {
    const onComplete = vi.fn();
    render(
      <ActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={onComplete}
      />,
    );
    const presentation = createChoicePresentation(activity);
    const wrong = presentation.options.find(
      ({ id }) => !presentation.evaluate(id),
    )!;
    const correct = presentation.options.find(({ id }) =>
      presentation.evaluate(id),
    )!;
    fireEvent.click(screen.getByRole('button', { name: wrong.label }));
    expect(screen.getByText(/tentar de novo/i)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: wrong.label }));
    expect(screen.getByText(/parte iluminada/i)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: correct.label }));
    expect(
      screen.getByRole('heading', { name: 'Você conseguiu!' }),
    ).toBeVisible();
    const dialog = screen.getByRole('dialog', { name: 'Você conseguiu!' });
    expect(dialog).toBeVisible();
    expect(document.body.style.overflow).toBe('hidden');
    const continueButton = screen.getByRole('button', { name: 'Continuar' });
    expect(continueButton).toHaveFocus();
    fireEvent.click(continueButton);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('mostra somente um fragmento como pista na fase Descobrir', () => {
    const deduction = mvpCatalogSeed.activities!.find(
      ({ levelId }) => levelId === 'level.logic.deduction.01',
    )!;

    render(
      <ActivityScreen
        activity={deduction}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    const presentation = createChoicePresentation(deduction);
    const clue = screen.getByLabelText(
      `Pista: parte de ${presentation.clue!.label}`,
    );
    expect(clue).toHaveAttribute('data-focus-x');
    expect(clue).toHaveAttribute('data-focus-y');
    expect(clue.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringMatching(/\/assets\/activity\/.+\.webp$/),
    );
    expect(
      screen.queryByLabelText('Sequência para observar'),
    ).not.toBeInTheDocument();
  });
});
