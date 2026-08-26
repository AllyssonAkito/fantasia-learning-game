export const audioEffectIds = [
  'success',
  'attempt',
  'hint',
  'reward',
  'reveal',
  'wrong-rumble',
] as const;

export type AudioEffectId = (typeof audioEffectIds)[number];

export interface ToneStep {
  frequencyHz: number;
  durationMs: number;
  endFrequencyHz?: number;
  waveform?: OscillatorType;
}

export interface AudioEffectDefinition {
  id: AudioEffectId;
  purpose: string;
  gain: number;
  tones: readonly ToneStep[];
}

export const audioEffectCatalog: Readonly<
  Record<AudioEffectId, AudioEffectDefinition>
> = {
  success: {
    id: 'success',
    purpose: 'Confirma uma resposta correta sem interromper o ritmo.',
    gain: 0.42,
    tones: [
      { frequencyHz: 523, durationMs: 90 },
      { frequencyHz: 659, durationMs: 120 },
    ],
  },
  attempt: {
    id: 'attempt',
    purpose: 'Convida a tentar novamente sem soar como punição.',
    gain: 0.28,
    tones: [
      { frequencyHz: 392, durationMs: 80 },
      { frequencyHz: 349, durationMs: 100 },
    ],
  },
  hint: {
    id: 'hint',
    purpose: 'Chama atenção para uma dica visual.',
    gain: 0.32,
    tones: [{ frequencyHz: 587, durationMs: 130 }],
  },
  reward: {
    id: 'reward',
    purpose: 'Celebra a recompensa ao fim da atividade.',
    gain: 0.45,
    tones: [
      { frequencyHz: 523, durationMs: 80 },
      { frequencyHz: 659, durationMs: 80 },
      { frequencyHz: 784, durationMs: 150 },
    ],
  },
  reveal: {
    id: 'reveal',
    purpose: 'Acompanha o surgimento de uma peça com um sopro curto e leve.',
    gain: 0.22,
    tones: [
      {
        frequencyHz: 1180,
        endFrequencyHz: 690,
        durationMs: 85,
        waveform: 'triangle',
      },
      {
        frequencyHz: 820,
        endFrequencyHz: 540,
        durationMs: 65,
        waveform: 'sine',
      },
    ],
  },
  'wrong-rumble': {
    id: 'wrong-rumble',
    purpose: 'Marca uma nova tentativa com um grave cômico e não punitivo.',
    gain: 0.24,
    tones: [
      {
        frequencyHz: 150,
        endFrequencyHz: 82,
        durationMs: 170,
        waveform: 'sawtooth',
      },
      {
        frequencyHz: 104,
        endFrequencyHz: 64,
        durationMs: 150,
        waveform: 'triangle',
      },
    ],
  },
};
