import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearningPath } from './LearningPath';

describe('LearningPath', () => {
  it('mostra destino atual e bloqueio com texto e estado nativo', () => {
    render(
      <LearningPath
        path={{
          status: 'ready',
          courseLabel: 'Lógica',
          courseIcon: 'icon.blocks',
          stops: [
            {
              destinationId: 'level.logic.path.01',
              label: 'Primeira estrela',
              icon: 'icon.star',
              state: 'current',
            },
            {
              destinationId: 'level.logic.path.02',
              label: 'Segunda estrela',
              icon: 'icon.star',
              state: 'locked',
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: '1. Primeira estrela. Pronto para brincar',
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', {
        name: '2. Segunda estrela. Bloqueado por enquanto',
      }),
    ).toBeDisabled();
  });

  it('apresenta estado vazio amigável', () => {
    render(<LearningPath path={{ status: 'empty', stops: [] }} />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Novas aventuras estão chegando',
    );
  });

  it('libera níveis bloqueados somente quando o modo de QA é solicitado', () => {
    render(
      <LearningPath
        path={{
          status: 'ready',
          courseLabel: 'Lógica',
          courseIcon: 'icon.blocks',
          stops: [
            {
              destinationId: 'level.logic.path.02',
              label: 'Segunda estrela',
              icon: 'icon.star',
              state: 'locked',
            },
          ],
        }}
        unlockAll
      />,
    );

    expect(
      screen.getByRole('button', {
        name: '1. Segunda estrela. Pronto para brincar',
      }),
    ).toBeEnabled();
  });

  it('mostra capas diferentes para Padrões, Montar e Descobrir', () => {
    const { container } = render(
      <LearningPath
        path={{
          status: 'ready',
          courseLabel: 'Lógica',
          courseIcon: 'icon.blocks',
          stops: [
            {
              destinationId: 'level.logic.patterns.01',
              label: 'Padrões',
              icon: 'icon.blocks',
              state: 'current',
              cover: {
                kind: 'sequence',
                assetIds: [
                  'asset.symbol.star',
                  'asset.symbol.heart',
                  'asset.symbol.star',
                ],
              },
            },
            {
              destinationId: 'level.logic.ordering.01',
              label: 'Montar',
              icon: 'icon.blocks',
              state: 'locked',
              cover: {
                kind: 'assembly',
                pieceIds: [
                  'asset.character.dog.top',
                  'asset.character.dog.middle',
                  'asset.character.dog.bottom',
                ],
              },
            },
            {
              destinationId: 'level.logic.deduction.01',
              label: 'Descobrir',
              icon: 'icon.blocks',
              state: 'locked',
              cover: {
                kind: 'clue',
                assetId: 'asset.symbol.rabbit',
                focusX: 'right',
                focusY: 'top',
              },
            },
          ],
        }}
      />,
    );

    expect(container.querySelectorAll('[data-cover]')).toHaveLength(3);
    expect(
      container.querySelector('[data-cover="sequence"] img'),
    ).toHaveAttribute('src', '/assets/activity/star.webp');
    expect(
      container.querySelectorAll('[data-cover="assembly"] img'),
    ).toHaveLength(3);
    expect(container.querySelector('[data-cover="clue"] img')).toHaveAttribute(
      'src',
      '/assets/activity/rabbit.webp',
    );
  });
});
