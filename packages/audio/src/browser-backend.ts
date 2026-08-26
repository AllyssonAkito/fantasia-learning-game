import type { AudioAvailability, AudioBackend } from './audio-service';
import type { AudioEffectDefinition } from './effect-catalog';

const femaleVoiceNameHints = [
  'female',
  'feminina',
  'mulher',
  'francisca',
  'luciana',
  'maria',
  'joana',
  'catarina',
  'fernanda',
  'heloisa',
  'mariana',
  'camila',
  'isabela',
  'leticia',
  'vitoria',
  'amelia',
  'ines',
  'mafalda',
  'google portugues do brasil',
] as const;

export const childNarrationSettings = {
  rate: 1.02,
  pitch: 1.16,
} as const;

function normalized(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function isLikelyFemaleVoice(voice: SpeechSynthesisVoice) {
  const name = normalized(voice.name);
  return femaleVoiceNameHints.some((hint) => name.includes(hint));
}

export function selectPortugueseVoice(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const language = (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase();
  const portugueseVoices = voices.filter((voice) =>
    language(voice).startsWith('pt'),
  );
  const brazilianVoices = portugueseVoices.filter((voice) =>
    language(voice).startsWith('pt-br'),
  );
  return (
    brazilianVoices.find(isLikelyFemaleVoice) ??
    portugueseVoices.find(isLikelyFemaleVoice) ??
    brazilianVoices[0] ??
    portugueseVoices[0]
  );
}

export class BrowserAudioBackend implements AudioBackend {
  private currentAudio?: HTMLAudioElement;
  private context?: AudioContext;

  get availability(): AudioAvailability {
    return {
      recorded: typeof Audio !== 'undefined',
      speech:
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined',
      effects:
        typeof window !== 'undefined' &&
        ('AudioContext' in window || 'webkitAudioContext' in window),
    };
  }

  playRecorded(source: string, volume: number) {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(source);
      this.currentAudio = audio;
      audio.volume = volume;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('recorded-audio-unavailable'));
      void audio.play().catch(reject);
    });
  }

  async speak(text: string, volume: number, language: string) {
    if (!this.availability.speech) throw new Error('speech-unavailable');
    const synthesis = window.speechSynthesis;
    let voice = selectPortugueseVoice(synthesis.getVoices());
    if (!voice) {
      await new Promise<void>((voicesReady) => {
        const finish = () => {
          synthesis.removeEventListener('voiceschanged', finish);
          voicesReady();
        };
        synthesis.addEventListener('voiceschanged', finish, { once: true });
        globalThis.setTimeout(finish, 700);
      });
      voice = selectPortugueseVoice(synthesis.getVoices());
    }
    if (!voice) throw new Error('portuguese-voice-unavailable');

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        voice.lang || (language.startsWith('pt') ? language : 'pt-BR');
      utterance.voice = voice;
      utterance.rate = childNarrationSettings.rate;
      utterance.pitch = childNarrationSettings.pitch;
      utterance.volume = volume;
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error('speech-failed'));
      synthesis.speak(utterance);
    });
  }

  async playEffect(effect: AudioEffectDefinition, volume: number) {
    const context = this.audioContext();
    if (!context) throw new Error('effects-unavailable');
    let cursor = context.currentTime;
    for (const tone of effect.tones) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = tone.waveform ?? 'sine';
      oscillator.frequency.setValueAtTime(tone.frequencyHz, cursor);
      if (tone.endFrequencyHz) {
        oscillator.frequency.exponentialRampToValueAtTime(
          tone.endFrequencyHz,
          cursor + tone.durationMs / 1000,
        );
      }
      gain.gain.setValueAtTime(volume, cursor);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        cursor + tone.durationMs / 1000,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(cursor);
      oscillator.stop(cursor + tone.durationMs / 1000);
      cursor += tone.durationMs / 1000;
    }
    await new Promise((resolve) =>
      globalThis.setTimeout(
        resolve,
        Math.max(0, (cursor - context.currentTime) * 1000),
      ),
    );
  }

  stopAll() {
    this.currentAudio?.pause();
    this.currentAudio = undefined;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private audioContext() {
    if (this.context) return this.context;
    if (typeof window === 'undefined') return undefined;
    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextConstructor) return undefined;
    this.context = new AudioContextConstructor();
    return this.context;
  }
}
