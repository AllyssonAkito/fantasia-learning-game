import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FoundationStatus } from './FoundationStatus';

describe('FoundationStatus', () => {
  it('apresenta um estado infantil seguro enquanto a plataforma é preparada', () => {
    render(<FoundationStatus />);

    expect(
      screen.getByRole('heading', { name: 'Fantasia está crescendo' }),
    ).toBeVisible();
    expect(
      screen.getByText('A nova plataforma está sendo preparada com carinho.'),
    ).toBeVisible();
  });
});
