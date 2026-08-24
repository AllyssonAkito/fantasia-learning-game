import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { InstructionAudioControl } from './InstructionAudioControl';

describe('InstructionAudioControl', () => {
  it('repete por toque e mantém a alternativa visual', async () => {
    const repeatInstruction = vi.fn(async () => 'visual-only' as const);
    const onRepeated = vi.fn();
    render(
      <InstructionAudioControl
        audio={{ repeatInstruction } as unknown as AudioService}
        instruction={{ text: 'Toque no diferente.' }}
        onRepeated={onRepeated}
      />,
    );
    expect(screen.getByText('Toque no diferente.')).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', { name: 'Ouvir a instrução novamente' }),
    );
    await waitFor(() => expect(repeatInstruction).toHaveBeenCalledOnce());
    expect(onRepeated).toHaveBeenCalledWith('visual-only');
    expect(screen.getByText(/áudio não está disponível/i)).toBeInTheDocument();
  });
});
