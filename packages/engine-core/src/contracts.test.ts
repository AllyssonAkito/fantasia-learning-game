import { describe, expect, it } from 'vitest';
import { difficultySettings } from './difficulty';
import { EngineRegistry, type ActivityEngine } from './engine-registry';
import { createEvaluation } from './evaluation';
import { createSeededRandom, seededShuffle } from './random';

describe('contratos compartilhados dos motores', () => {
  const engine: ActivityEngine<{ expected: string }, string> = {
    id: 'choice',
    evaluate: (definition, answer) =>
      createEvaluation(answer === definition.expected, { answer }),
  };

  it('resolve motor por ID sem condicional de tela', () => {
    const registry = new EngineRegistry().register(engine);
    expect(registry.resolve<{ expected: string }, string>('choice')).toBe(
      engine,
    );
    expect(() => registry.resolve('missing')).toThrow('não está disponível');
    expect(() => registry.register(engine)).toThrow('já está registrado');
  });

  it('padroniza acerto, erro e metadados', () => {
    expect(engine.evaluate({ expected: 'A' }, 'A')).toEqual({
      correct: true,
      outcome: 'correct',
      metadata: { answer: 'A' },
    });
    expect(engine.evaluate({ expected: 'A' }, 'B').outcome).toBe('incorrect');
  });

  it('reproduz a mesma sessão pela seed', () => {
    expect(seededShuffle([1, 2, 3, 4], 'melina')).toEqual(
      seededShuffle([1, 2, 3, 4], 'melina'),
    );
    const first = createSeededRandom('sessão')();
    expect(createSeededRandom('sessão')()).toBe(first);
  });

  it('normaliza dificuldade interna de 1 a 10', () => {
    expect(difficultySettings(1).band).toBe('intro');
    expect(difficultySettings(10)).toMatchObject({
      band: 'mastery',
      distractorPressure: 4,
    });
    expect(() => difficultySettings(0)).toThrow('1 a 10');
  });
});
