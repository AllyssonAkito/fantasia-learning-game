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
        seed="ordem-errada"
      />,
    );
    const pieces = screen.getByLabelText('Peças disponíveis');
    const definition = activity.content as {
      pieces: { id: string; slotId: string; order: number }[];
    };
    const pieceButtons = pieces.querySelectorAll('button');
    expect(pieceButtons).toHaveLength(3);
    const ordered = [...definition.pieces].sort((a, b) => a.order - b.order);
    const wrongOrder = ordered.slice(1).concat(ordered[0]!);
    const slotNames = ['Lugar de cima', 'Lugar do meio', 'Lugar de baixo'];
    for (let index = 0; index < wrongOrder.length; index += 1) {
      const label = mvpAssetById.get(wrongOrder[index]!.id)!.alt;
      fireEvent.click(screen.getByRole('button', { name: label }));
      fireEvent.click(
        screen.getByRole('button', { name: `${slotNames[index]} vazio` }),
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
        seed="ordem-certa"
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
      const slotName =
        piece.slotId === 'top'
          ? 'Lugar de cima'
          : piece.slotId === 'middle'
            ? 'Lugar do meio'
            : 'Lugar de baixo';
      fireEvent.click(
        screen.getByRole('button', { name: `${slotName} vazio` }),
      );
    }
    expect(
      screen.getByRole('heading', { name: 'Você conseguiu!' }),
    ).toBeVisible();
  });

  it('não mostra números ou símbolos abstratos nos destinos', () => {
    render(
      <AssemblyActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
        seed="sem-numeros"
      />,
    );
    expect(screen.queryAllByText(/^[123]$/)).toHaveLength(0);
    expect(document.querySelectorAll('img')).toHaveLength(3);
  });

  it('encaixa uma peça ao arrastar com ponteiro', () => {
    render(
      <AssemblyActivityScreen
        activity={activity}
        audio={audio}
        onBack={vi.fn()}
        onComplete={vi.fn()}
        seed="arrastar"
      />,
    );
    const piece = screen
      .getByLabelText('Peças disponíveis')
      .querySelector('button')!;
    const label = piece.getAttribute('aria-label')!;
    const slot = screen.getByRole('button', { name: 'Lugar de cima vazio' });
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => slot),
    });

    fireEvent.pointerDown(piece, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(piece, { clientX: 40, clientY: 10, pointerId: 1 });
    fireEvent.pointerUp(piece, { clientX: 80, clientY: 10, pointerId: 1 });

    expect(
      screen.getByRole('button', { name: `Lugar de cima: ${label}` }),
    ).toBeVisible();
  });
});
