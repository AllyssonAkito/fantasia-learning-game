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
        name: 'Primeira estrela. Pronto para brincar',
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', {
        name: 'Segunda estrela. Bloqueado por enquanto',
      }),
    ).toBeDisabled();
  });

  it('apresenta estado vazio amigável', () => {
    render(<LearningPath path={{ status: 'empty', stops: [] }} />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Novas aventuras estão chegando',
    );
  });
});
