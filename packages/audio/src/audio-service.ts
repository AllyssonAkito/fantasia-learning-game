import {
  audioEffectCatalog,
  type AudioEffectDefinition,
  type AudioEffectId,
} from './effect-catalog';

export interface AudioAvailability {
  recorded: boolean;
  speech: boolean;
  effects: boolean;
}

export interface AudioBackend {
  readonly availability: AudioAvailability;
  playRecorded(source: string, volume: number): Promise<void>;
  speak(text: string, volume: number, language: string): Promise<void>;
  playEffect(effect: AudioEffectDefinition, volume: number): Promise<void>;
  stopAll(): void;
}

export interface InstructionAudio {
  text: string;
  recordedSource?: string;
  language?: string;
}

export interface AudioServiceOptions {
  speechVolume?: number;
  effectVolume?: number;
  duckedEffectVolume?: number;
  onUnavailable?: (instruction: InstructionAudio) => void;
}

export type InstructionResult = 'recorded' | 'tts' | 'visual-only' | 'muted';

interface QueueItem {
  instruction: InstructionAudio;
  resolve: (result: InstructionResult) => void;
}

const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

export class AudioService {
  private readonly queue: QueueItem[] = [];
  private playingQueue = false;
  private speaking = false;
  private muted = false;
  private generation = 0;
  private readonly speechVolume: number;
  private readonly effectVolume: number;
  private readonly duckedEffectVolume: number;
  private readonly onUnavailable?: (instruction: InstructionAudio) => void;

  constructor(
    private readonly backend: AudioBackend,
    options: AudioServiceOptions = {},
  ) {
    this.speechVolume = clampVolume(options.speechVolume ?? 1);
    this.effectVolume = clampVolume(options.effectVolume ?? 0.45);
    this.duckedEffectVolume = clampVolume(options.duckedEffectVolume ?? 0.16);
    this.onUnavailable = options.onUnavailable;
  }

  get isMuted() {
    return this.muted;
  }

  get availability() {
    return this.backend.availability;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.interrupt();
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playInstruction(
    instruction: InstructionAudio,
    options: { interrupt?: boolean } = {},
  ): Promise<InstructionResult> {
    if (this.muted) return Promise.resolve('muted');
    if (options.interrupt ?? true) this.interrupt();

    return new Promise((resolve) => {
      this.queue.push({ instruction, resolve });
      void this.drainQueue();
    });
  }

  repeatInstruction(instruction: InstructionAudio) {
    return this.playInstruction(instruction, { interrupt: true });
  }

  async playEffect(id: AudioEffectId): Promise<boolean> {
    if (this.muted || !this.backend.availability.effects) return false;
    const baseVolume = this.speaking
      ? this.duckedEffectVolume
      : this.effectVolume;
    const effect = audioEffectCatalog[id];
    await this.backend.playEffect(
      effect,
      clampVolume(baseVolume * effect.gain),
    );
    return true;
  }

  interrupt() {
    this.generation += 1;
    this.backend.stopAll();
    this.speaking = false;
    while (this.queue.length > 0) this.queue.shift()?.resolve('visual-only');
  }

  private async drainQueue() {
    if (this.playingQueue) return;
    this.playingQueue = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;
      const generation = this.generation;
      const result = await this.performInstruction(item.instruction);
      item.resolve(generation === this.generation ? result : 'visual-only');
    }

    this.playingQueue = false;
  }

  private async performInstruction(
    instruction: InstructionAudio,
  ): Promise<InstructionResult> {
    this.speaking = true;
    try {
      if (instruction.recordedSource && this.backend.availability.recorded) {
        try {
          await this.backend.playRecorded(
            instruction.recordedSource,
            this.speechVolume,
          );
          return 'recorded';
        } catch {
          // A falha do arquivo gravado cai em TTS e nunca bloqueia a atividade.
        }
      }

      if (this.backend.availability.speech) {
        try {
          await this.backend.speak(
            instruction.text,
            this.speechVolume,
            instruction.language ?? 'pt-BR',
          );
          return 'tts';
        } catch {
          // O apoio visual continua disponível abaixo.
        }
      }

      this.onUnavailable?.(instruction);
      return 'visual-only';
    } finally {
      this.speaking = false;
    }
  }
}
