import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Mascot, type MascotState } from './Mascot';

describe('Mascot', () => {
  it.each<MascotState>(['neutral', 'instruction', 'hint', 'celebration'])(
    'renderiza o estado %s',
    (state) => {
      render(
        <Mascot
          avatarId="avatar.bunny"
          message="Vamos brincar?"
          state={state}
        />,
      );
      expect(screen.getByLabelText(/Coelhinho/)).toHaveAttribute(
        'data-state',
        state,
      );
      expect(screen.getByRole('img', { name: 'Coelhinho' })).toBeVisible();
    },
  );
});
