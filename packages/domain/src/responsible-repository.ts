import { responsibleSchema, type Responsible } from './responsible';

export interface ResponsibleRepository {
  findById(id: string): Promise<Responsible | null>;
  save(responsible: Responsible): Promise<Responsible>;
  remove(id: string): Promise<boolean>;
}

function copy(responsible: Responsible): Responsible {
  return { ...responsible };
}

export class InMemoryResponsibleRepository implements ResponsibleRepository {
  readonly #records = new Map<string, Responsible>();

  constructor(seed: readonly Responsible[] = []) {
    for (const candidate of seed) {
      const responsible = responsibleSchema.parse(candidate);
      this.#records.set(responsible.id, copy(responsible));
    }
  }

  async findById(id: string): Promise<Responsible | null> {
    const responsible = this.#records.get(id);
    return responsible ? copy(responsible) : null;
  }

  async save(candidate: Responsible): Promise<Responsible> {
    const responsible = responsibleSchema.parse(candidate);
    this.#records.set(responsible.id, copy(responsible));
    return copy(responsible);
  }

  async remove(id: string): Promise<boolean> {
    return this.#records.delete(id);
  }
}
