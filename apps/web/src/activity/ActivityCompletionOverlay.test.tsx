import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';

describe('ActivityCompletionOverlay', () => {
  it('bloqueia a página, foca continuar e restaura a rolagem ao fechar', () => {
    const onContinue = vi.fn();
    const { unmount } = render(
      <ActivityCompletionOverlay coins={2} onContinue={onContinue} stars={3} />,
    );
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(document.body.style.overflow).toBe('hidden');
    const button = screen.getByRole('button', { name: 'Continuar' });
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onContinue).toHaveBeenCalledOnce();
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
