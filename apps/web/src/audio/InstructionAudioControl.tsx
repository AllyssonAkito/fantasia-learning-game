import { useState } from 'react';
import type {
  AudioService,
  InstructionAudio,
  InstructionResult,
} from '@fantasia/audio';

export interface InstructionAudioControlProps {
  audio: AudioService;
  instruction: InstructionAudio;
  onRepeated?: (result: InstructionResult) => void;
}

export function InstructionAudioControl({
  audio,
  instruction,
  onRepeated,
}: InstructionAudioControlProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'visual-only'>(
    'idle',
  );

  async function repeat() {
    setStatus('playing');
    const result = await audio.repeatInstruction(instruction);
    setStatus(result === 'visual-only' ? 'visual-only' : 'idle');
    onRepeated?.(result);
  }

  return (
    <div className="instruction-audio">
      <button
        aria-label="Ouvir a instrução novamente"
        className="instruction-audio__button"
        disabled={status === 'playing'}
        onClick={() => void repeat()}
        type="button"
      >
        <span aria-hidden="true">🔊</span>
        {status === 'playing' ? 'Ouvindo…' : 'Ouvir de novo'}
      </button>
      <p className="instruction-audio__text">{instruction.text}</p>
      <span aria-live="polite" className="visually-hidden">
        {status === 'visual-only'
          ? 'O áudio não está disponível. A instrução está escrita na tela.'
          : ''}
      </span>
    </div>
  );
}
