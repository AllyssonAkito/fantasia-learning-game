import {
  assemblyEngine,
  associationEngine,
  choiceEngine,
  classificationEngine,
  comparisonEngine,
  dragEngine,
  memoryEngine,
  sequenceEngine,
} from '@fantasia/engines';

export interface EngineExample {
  id: string;
  label: string;
  run(correct: boolean): boolean;
}
const base = { difficulty: 2, prompt: 'Exemplo visual' };
export const engineExamples: readonly EngineExample[] = [
  {
    id: 'choice',
    label: 'Escolha',
    run: (ok) =>
      choiceEngine.evaluate(
        {
          ...base,
          options: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
          correctOptionId: 'a',
        },
        ok ? 'a' : 'b',
      ).correct,
  },
  {
    id: 'drag',
    label: 'Arrastar / selecionar',
    run: (ok) =>
      dragEngine.evaluate(
        {
          ...base,
          items: [{ id: 'item', targetId: 'right' }],
          targets: [
            { id: 'right', label: 'Certo' },
            { id: 'wrong', label: 'Outro' },
          ],
        },
        { interaction: 'select', placements: { item: ok ? 'right' : 'wrong' } },
      ).correct,
  },
  {
    id: 'sequence',
    label: 'Sequência',
    run: (ok) =>
      sequenceEngine.evaluate(
        {
          ...base,
          pattern: ['a', 'b'],
          options: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
          expectedId: 'a',
        },
        ok ? 'a' : 'b',
      ).correct,
  },
  {
    id: 'association',
    label: 'Associação',
    run: (ok) =>
      associationEngine.evaluate(
        { ...base, mode: 'one-to-one', relations: { coelho: 'cenoura' } },
        { coelho: ok ? 'cenoura' : 'bola' },
      ).correct,
  },
  {
    id: 'classification',
    label: 'Classificação',
    run: (ok) =>
      classificationEngine.evaluate(
        {
          ...base,
          groups: [
            { id: 'animal', label: 'Animal' },
            { id: 'objeto', label: 'Objeto' },
          ],
          assignments: { urso: 'animal' },
        },
        { urso: ok ? 'animal' : 'objeto' },
      ).correct,
  },
  {
    id: 'memory',
    label: 'Memória',
    run: (ok) =>
      memoryEngine.evaluate(
        { ...base, mode: 'sequence', expected: ['a', 'b'], revealMs: 1000 },
        ok ? ['a', 'b'] : ['b', 'a'],
      ).correct,
  },
  {
    id: 'comparison',
    label: 'Comparação',
    run: (ok) =>
      comparisonEngine.evaluate(
        {
          ...base,
          dimension: 'quantity',
          candidates: [
            { id: 'one', value: 1 },
            { id: 'two', value: 2 },
          ],
          expectedId: 'two',
        },
        ok ? 'two' : 'one',
      ).correct,
  },
  {
    id: 'assembly',
    label: 'Montagem',
    run: (ok) =>
      assemblyEngine.evaluate(
        {
          ...base,
          pieces: [
            { id: 'head', slotId: 'top', order: 0 },
            { id: 'body', slotId: 'bottom', order: 1 },
          ],
          snapTolerance: 24,
          resetOnIncorrect: true,
        },
        {
          placements: { head: 'top', body: 'bottom' },
          order: ok ? ['head', 'body'] : ['body', 'head'],
        },
      ).correct,
  },
];
