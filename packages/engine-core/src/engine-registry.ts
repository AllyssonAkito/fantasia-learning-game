import type { EvaluationResult } from './evaluation';

export interface ActivityEngine<Definition = unknown, Answer = unknown> {
  readonly id: string;
  evaluate(definition: Definition, answer: Answer): EvaluationResult;
}

export class EngineRegistry {
  readonly #engines = new Map<string, ActivityEngine>();

  register(engine: ActivityEngine): this {
    if (!engine.id.trim()) throw new Error('O motor precisa de um ID.');
    if (this.#engines.has(engine.id))
      throw new Error(`O motor ${engine.id} já está registrado.`);
    this.#engines.set(engine.id, engine);
    return this;
  }

  resolve<Definition = unknown, Answer = unknown>(
    id: string,
  ): ActivityEngine<Definition, Answer> {
    const engine = this.#engines.get(id);
    if (!engine)
      throw new Error(
        'Esta brincadeira não está disponível agora. Escolha outra atividade.',
      );
    return engine as ActivityEngine<Definition, Answer>;
  }

  has(id: string): boolean {
    return this.#engines.has(id);
  }
}
