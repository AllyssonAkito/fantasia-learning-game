import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AudioService,
  InstructionAudio,
  InstructionResult,
} from '@fantasia/audio';

export interface InstructionAudioControlProps {
  audio: AudioService;
  instruction: InstructionAudio;
  autoPlay?: boolean;
  onRepeated?: (result: InstructionResult) => void;
}

export function InstructionAudioControl({
  audio,
  instruction,
  autoPlay = false,
  onRepeated,
}: InstructionAudioControlProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'visual-only'>(
    'idle',
  );

  const repeat = useCallback(async () => {
    setStatus('playing');
    const result = await audio.repeatInstruction(instruction);
    setStatus(result === 'visual-only' ? 'visual-only' : 'idle');
    onRepeated?.(result);
  }, [audio, instruction, onRepeated]);
  const autoPlayed = useRef(false);

  useEffect(() => {
    if (!autoPlay || autoPlayed.current) return;
    autoPlayed.current = true;
    void repeat();
  }, [autoPlay, repeat]);

  return (
    <div className="instruction-audio">
      <button
        aria-label="Ouvir a instrução novamente"
        className="instruction-audio__button"
        data-playing={status === 'playing'}
        disabled={status === 'playing'}
        onClick={() => void repeat()}
        type="button"
      >
        <span aria-hidden="true">{status === 'playing' ? '🔉' : '🔊'}</span>
      </button>
      <span aria-live="polite" className="visually-hidden">
        {status === 'playing'
          ? 'Reproduzindo instrução.'
          : status === 'visual-only'
            ? `O áudio não está disponível. Instrução: ${instruction.text}`
            : ''}
      </span>
    </div>
  );
}
