import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RewardCelebration } from './RewardCelebration';

describe('RewardCelebration', () => {
  it('apresenta reforço curto com alternativa textual', () => {
    render(<RewardCelebration stars={2} coins={3} />);
    const celebration = screen.getByRole('status');
    expect(celebration).toHaveAttribute('data-duration-ms', '1400');
    expect(celebration).toHaveTextContent('2 estrelas e 3 moedas');
  });
});
