import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { mvpCatalogSeed } from '@fantasia/content';
import { ActivityScreen } from './ActivityScreen';

const audio = {
  repeatInstruction: vi.fn(async () => 'visual-only' as const),
  playEffect: vi.fn(async () => true),
} as unknown as AudioService;

function activity(id: string) {
  return mvpCatalogSeed.activities!.find((item) => item.id === id)!;
}

const commonProps = {
  audio,
  onBack: vi.fn(),
  onComplete: vi.fn(),
};

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('fluxos da expansão progressiva', () => {
  it('conclui uma associação do nível Reconhecer por toque sequencial', () => {
    render(
      <ActivityScreen
        {...commonProps}
        activity={activity('activity.association.journey-a.002')}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'cenoura' }));
    fireEvent.click(screen.getByRole('button', { name: 'coelhinho vazio' }));
    fireEvent.click(screen.getByRole('button', { name: 'bola colorida' }));
    fireEvent.click(screen.getByRole('button', { name: 'cachorrinho vazio' }));
    expect(
      screen.getByRole('dialog', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });

  it('completa o nome Melina no nível Relacionar', () => {
    render(
      <ActivityScreen
        {...commonProps}
        activity={activity('activity.numbers.journey-b.006')}
      />,
    );
    expect(screen.getByLabelText('Sequência para observar')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'letra A' }));
    expect(
      screen.getByRole('dialog', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });

  it('ordena as letras de Melina no nível Combinar', () => {
    vi.useFakeTimers();
    render(
      <ActivityScreen
        {...commonProps}
        activity={activity('activity.memory.journey-c.006')}
      />,
    );
    act(() => vi.advanceTimersByTime(2400));
    for (const letter of ['M', 'E', 'L', 'I', 'N', 'A']) {
      fireEvent.click(screen.getByRole('button', { name: `letra ${letter}` }));
    }
    expect(
      screen.getByRole('dialog', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });
});
