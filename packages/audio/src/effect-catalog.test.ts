import { describe, expect, it } from 'vitest';
import { audioEffectCatalog, audioEffectIds } from './effect-catalog';

describe('catálogo de efeitos', () => {
  it('oferece sopro de surgimento e grave de nova tentativa', () => {
    expect(audioEffectIds).toContain('reveal');
    expect(audioEffectIds).toContain('wrong-rumble');
    expect(audioEffectCatalog.reveal.tones).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          endFrequencyHz: expect.any(Number),
          waveform: 'triangle',
        }),
      ]),
    );
    expect(audioEffectCatalog['wrong-rumble']).toMatchObject({
      gain: expect.any(Number),
      tones: expect.arrayContaining([
        expect.objectContaining({ waveform: 'sawtooth' }),
      ]),
    });
    expect(audioEffectCatalog['wrong-rumble'].gain).toBeLessThan(0.3);
  });
});
