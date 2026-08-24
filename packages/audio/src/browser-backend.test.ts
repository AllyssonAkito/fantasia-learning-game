import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserAudioBackend, selectPortugueseVoice } from './browser-backend';

function voice(name: string, lang: string) {
  return {
    default: false,
    lang,
    localService: true,
    name,
    voiceURI: name,
  } as SpeechSynthesisVoice;
}

afterEach(() => vi.unstubAllGlobals());

describe('BrowserAudioBackend', () => {
  it('prioriza pt-BR, depois outra voz em português, e nunca inglês', () => {
    const english = voice('English', 'en-US');
    const portuguese = voice('Português', 'pt-PT');
    const brazilian = voice('Brasil', 'pt-BR');
    expect(selectPortugueseVoice([english, portuguese, brazilian])).toBe(
      brazilian,
    );
    expect(selectPortugueseVoice([english, portuguese])).toBe(portuguese);
    expect(selectPortugueseVoice([english])).toBeUndefined();
  });

  it('atribui a voz brasileira à fala', async () => {
    const brazilian = voice('Brasil', 'pt-BR');
    class Utterance {
      lang = '';
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;
      pitch = 1;
      volume = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(readonly text: string) {}
    }
    const speak = vi.fn((utterance: Utterance) => utterance.onend?.());
    const synthesis = {
      getVoices: () => [voice('English', 'en-US'), brazilian],
      speak,
      cancel: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
    vi.stubGlobal('window', { speechSynthesis: synthesis });

    await new BrowserAudioBackend().speak('Vamos brincar', 1, 'pt-BR');
    expect(speak.mock.calls[0]![0]).toMatchObject({
      lang: 'pt-BR',
      voice: brazilian,
    });
  });
});
