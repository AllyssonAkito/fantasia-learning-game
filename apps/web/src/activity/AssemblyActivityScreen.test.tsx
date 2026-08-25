import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { mvpAssetById, mvpCatalogSeed } from '@fantasia/content';
import { AssemblyActivityScreen } from './AssemblyActivityScreen';

const activity = mvpCatalogSeed.activities![6]!;
const audio = {
  repeatInstruction: vi.fn(async () => 'visual-only' as const),
  playEffect: vi.fn(async () => true),
} as unknown as AudioService;

describe('AssemblyActivityScreen', () => {
  it('mantém peças à esquerda e devolve todas após ordem errada', () => {
    render(
      <AssemblyActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    const pieces = screen.getByLabelText('Peças disponíveis');
    const pieceButtons = pieces.querySelectorAll('button');
    expect(pieceButtons).toHaveLength(3);
    for (let index = 0; index < 3; index += 1) {
      fireEvent.click(pieceButtons[index]!);
      fireEvent.click(
        screen.getByRole('button', { name: `Lugar ${index + 1} vazio` }),
      );
    }
    expect(screen.getByText(/tentar de novo/i)).toBeVisible();
    expect(pieces.querySelectorAll('button')).toHaveLength(3);
  });

  it('conclui quando peças ocupam os lugares declarados', () => {
    render(
      <AssemblyActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    const definition = activity.content as {
      pieces: { id: string; slotId: string; order: number }[];
    };
    for (const piece of [...definition.pieces].sort(
      (a, b) => a.order - b.order,
    )) {
      const label = mvpAssetById.get(piece.id)?.alt ?? piece.id;
      const button = screen.getByRole('button', { name: label });
      fireEvent.click(button);
      const slotIndex = [...definition.pieces]
        .sort((a, b) => a.order - b.order)
        .findIndex(({ slotId }) => slotId === piece.slotId);
      fireEvent.click(
        screen.getByRole('button', { name: `Lugar ${slotIndex + 1} vazio` }),
      );
    }
    expect(
      screen.getByRole('heading', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });
});
