import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AudioService } from '@fantasia/audio';
import { InstructionAudioControl } from './InstructionAudioControl';

describe('InstructionAudioControl', () => {
  it('reproduz automaticamente uma vez ao entrar na atividade', async () => {
    const repeatInstruction = vi.fn(async () => 'played' as const);
    const { rerender } = render(
      <InstructionAudioControl
        autoPlay
        audio={{ repeatInstruction } as unknown as AudioService}
        instruction={{ text: 'Escolha o coelhinho.' }}
      />,
    );
    await waitFor(() => expect(repeatInstruction).toHaveBeenCalledOnce());
    rerender(
      <InstructionAudioControl
        autoPlay
        audio={{ repeatInstruction } as unknown as AudioService}
        instruction={{ text: 'Escolha o coelhinho.' }}
      />,
    );
    expect(repeatInstruction).toHaveBeenCalledOnce();
  });

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
    expect(screen.queryByText('Toque no diferente.')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ouvir a instrução novamente' }),
    ).toHaveTextContent('🔊');
    fireEvent.click(
      screen.getByRole('button', { name: 'Ouvir a instrução novamente' }),
    );
    await waitFor(() => expect(repeatInstruction).toHaveBeenCalledOnce());
    expect(onRepeated).toHaveBeenCalledWith('visual-only');
    expect(screen.getByText(/áudio não está disponível/i)).toBeInTheDocument();
  });
});
