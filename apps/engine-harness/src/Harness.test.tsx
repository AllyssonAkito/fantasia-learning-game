import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Harness } from './Harness';
describe('Harness', () => {
  it('executa os oito exemplos fora do produto', () => {
    render(<Harness />);
    expect(screen.getAllByRole('article')).toHaveLength(8);
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Executar acerto' })[0]!,
    );
    expect(screen.getByText('Acerto ✓')).toBeInTheDocument();
  });
});
