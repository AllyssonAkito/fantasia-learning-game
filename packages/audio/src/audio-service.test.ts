import { describe, expect, it, vi } from 'vitest';
import { AudioService, type AudioBackend } from './audio-service';

function backend(
  availability = { recorded: true, speech: true, effects: true },
) {
  const playRecorded = vi
    .fn<AudioBackend['playRecorded']>()
    .mockResolvedValue(undefined);
  const speak = vi.fn<AudioBackend['speak']>().mockResolvedValue(undefined);
  const playEffect = vi
    .fn<AudioBackend['playEffect']>()
    .mockResolvedValue(undefined);
  return {
    availability,
    playRecorded,
    speak,
    playEffect,
    stopAll: vi.fn(),
  } satisfies AudioBackend;
}

describe('AudioService', () => {
  it('reproduz instrução gravada e mantém fila em ordem', async () => {
    const driver = backend();
    const service = new AudioService(driver);
    const first = service.playInstruction(
      { text: 'Primeira', recordedSource: '/one.mp3' },
      { interrupt: false },
    );
    const second = service.playInstruction(
      { text: 'Segunda', recordedSource: '/two.mp3' },
      { interrupt: false },
    );
    await expect(Promise.all([first, second])).resolves.toEqual([
      'recorded',
      'recorded',
    ]);
    expect(driver.playRecorded.mock.calls.map(([source]) => source)).toEqual([
      '/one.mp3',
      '/two.mp3',
    ]);
  });

  it('usa TTS quando o arquivo gravado falha', async () => {
    const driver = backend();
    driver.playRecorded.mockRejectedValueOnce(new Error('offline'));
    const service = new AudioService(driver);
    await expect(
      service.playInstruction({
        text: 'Toque na estrela',
        recordedSource: '/x',
      }),
    ).resolves.toBe('tts');
    expect(driver.speak).toHaveBeenCalledWith('Toque na estrela', 1, 'pt-BR');
  });

  it('não encaminha idioma inglês para a narração infantil', async () => {
    const driver = backend({ recorded: false, speech: true, effects: false });
    const service = new AudioService(driver);
    await expect(
      service.playInstruction({ text: 'Vamos brincar', language: 'en-US' }),
    ).resolves.toBe('tts');
    expect(driver.speak).toHaveBeenCalledWith('Vamos brincar', 1, 'pt-BR');
  });

  it('oferece apoio visual quando todo áudio está indisponível', async () => {
    const onUnavailable = vi.fn();
    const service = new AudioService(
      backend({ recorded: false, speech: false, effects: false }),
      { onUnavailable },
    );
    await expect(
      service.repeatInstruction({ text: 'Olhe a figura' }),
    ).resolves.toBe('visual-only');
    expect(onUnavailable).toHaveBeenCalledWith({ text: 'Olhe a figura' });
    await expect(service.playEffect('success')).resolves.toBe(false);
  });

  it('interrompe e silencia de modo seguro', async () => {
    const driver = backend();
    const service = new AudioService(driver);
    service.setMuted(true);
    await expect(service.playInstruction({ text: 'Olá' })).resolves.toBe(
      'muted',
    );
    expect(driver.stopAll).toHaveBeenCalledOnce();
    expect(service.toggleMuted()).toBe(false);
  });

  it('reduz o efeito enquanto a fala está ativa', async () => {
    let release!: () => void;
    const driver = backend();
    driver.speak.mockImplementation(
      () => new Promise<void>((resolve) => (release = resolve)),
    );
    const service = new AudioService(driver, {
      effectVolume: 0.5,
      duckedEffectVolume: 0.1,
    });
    const instruction = service.playInstruction({ text: 'Escute' });
    await Promise.resolve();
    await service.playEffect('hint');
    expect(driver.playEffect.mock.calls[0]?.[1]).toBeCloseTo(0.032);
    release();
    await instruction;
  });
});
