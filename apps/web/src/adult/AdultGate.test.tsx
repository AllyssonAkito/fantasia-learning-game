import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdultGate } from './AdultGate';

afterEach(() => vi.useRealTimers());

describe('AdultGate', () => {
  it('não desbloqueia configurações com toque simples', () => {
    const onUnlock = vi.fn();
    render(<AdultGate holdDurationMs={2000} onUnlock={onUnlock} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Abrir acesso do responsável' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Segure por 2 segundos' }),
    );

    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('desbloqueia somente após manter pressionado', () => {
    vi.useFakeTimers();
    const onUnlock = vi.fn();
    render(<AdultGate holdDurationMs={2000} onUnlock={onUnlock} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Abrir acesso do responsável' }),
    );
    const hold = screen.getByRole('button', { name: 'Segure por 2 segundos' });

    fireEvent.pointerDown(hold);
    act(() => vi.advanceTimersByTime(1999));
    expect(onUnlock).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));

    expect(onUnlock).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
