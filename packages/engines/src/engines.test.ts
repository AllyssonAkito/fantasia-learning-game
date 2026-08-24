import { EngineRegistry } from '@fantasia/engine-core';
import { describe, expect, it } from 'vitest';
import {
  allEngines,
  assemblyEngine,
  associationEngine,
  choiceDefinitionSchema,
  choiceEngine,
  classificationEngine,
  comparisonEngine,
  dragEngine,
  memoryEngine,
  registerAllEngines,
  sequenceEngine,
} from './engines';

const base = { difficulty: 2, prompt: 'Vamos brincar?' };

describe('oito motores reutilizáveis', () => {
  it('registra todos por ID', () => {
    const registry = registerAllEngines(new EngineRegistry());
    expect(allEngines).toHaveLength(8);
    expect(allEngines.every((engine) => registry.has(engine.id))).toBe(true);
  });

  it('avalia escolha com duas a quatro opções', () => {
    const definition = {
      ...base,
      options: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
      correctOptionId: 'a',
    };
    expect(choiceEngine.evaluate(definition, 'a').correct).toBe(true);
    expect(choiceEngine.evaluate(definition, 'b').correct).toBe(false);
    expect(
      choiceDefinitionSchema.safeParse({ ...definition, options: [] }).success,
    ).toBe(false);
  });

  it('avalia arrastar e alternativa por seleção para múltiplos destinos', () => {
    const definition = {
      ...base,
      items: [
        { id: 'sol', targetId: 'ceu' },
        { id: 'peixe', targetId: 'agua' },
      ],
      targets: [
        { id: 'ceu', label: 'Céu' },
        { id: 'agua', label: 'Água' },
      ],
    };
    expect(
      dragEngine.evaluate(definition, {
        interaction: 'select',
        placements: { sol: 'ceu', peixe: 'agua' },
      }),
    ).toMatchObject({ correct: true, metadata: { interaction: 'select' } });
  });

  it('avalia sequência configurada pelo conteúdo', () => {
    expect(
      sequenceEngine.evaluate(
        {
          ...base,
          pattern: ['rosa', 'azul', 'rosa'],
          options: [
            { id: 'azul', label: 'Azul' },
            { id: 'verde', label: 'Verde' },
          ],
          expectedId: 'azul',
        },
        'azul',
      ).correct,
    ).toBe(true);
  });

  it('avalia associação um-a-um ou por categoria', () => {
    expect(
      associationEngine.evaluate(
        {
          ...base,
          mode: 'category',
          relations: { coelho: 'terra', peixe: 'agua' },
        },
        { coelho: 'terra', peixe: 'agua' },
      ).correct,
    ).toBe(true);
  });

  it('classifica em dois a quatro grupos', () => {
    expect(
      classificationEngine.evaluate(
        {
          ...base,
          groups: [
            { id: 'animal', label: 'Animal' },
            { id: 'objeto', label: 'Objeto' },
          ],
          assignments: { urso: 'animal', bola: 'objeto' },
        },
        { urso: 'animal', bola: 'objeto' },
      ).correct,
    ).toBe(true);
  });

  it('suporta memória de pares, sequência e posições com ocultação', () => {
    expect(
      memoryEngine.evaluate(
        {
          ...base,
          mode: 'pairs',
          expected: ['a', 'a', 'b', 'b'],
          revealMs: 1500,
        },
        ['a', 'a', 'b', 'b'],
      ),
    ).toMatchObject({ correct: true, metadata: { hidesAfterMs: 1500 } });
  });

  it('compara quantidade ou tamanho', () => {
    expect(
      comparisonEngine.evaluate(
        {
          ...base,
          dimension: 'quantity',
          candidates: [
            { id: 'one', value: 1 },
            { id: 'three', value: 3 },
          ],
          expectedId: 'three',
        },
        'three',
      ).correct,
    ).toBe(true);
  });

  it('monta por encaixe e ordem e pede reset quando incorreto', () => {
    const definition = {
      ...base,
      pieces: [
        { id: 'head', slotId: 'top', order: 0 },
        { id: 'body', slotId: 'bottom', order: 1 },
      ],
      snapTolerance: 24,
      resetOnIncorrect: true as const,
    };
    expect(
      assemblyEngine.evaluate(definition, {
        placements: { head: 'top', body: 'bottom' },
        order: ['body', 'head'],
      }),
    ).toMatchObject({ correct: false, metadata: { resetPieces: true } });
    expect(
      assemblyEngine.evaluate(definition, {
        placements: { head: 'top', body: 'bottom' },
        order: ['head', 'body'],
      }).correct,
    ).toBe(true);
  });
});
