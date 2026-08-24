import { responsibleSchema, type Responsible } from './responsible';
import type { ResponsibleRepository } from './responsible-repository';

export type ResponsibleSessionState =
  | { status: 'anonymous' }
  | { status: 'loading' }
  | { status: 'authenticated'; responsible: Responsible }
  | { status: 'error'; message: string }
  | { status: 'signedOut' };

export class ResponsibleSession {
  #state: ResponsibleSessionState = { status: 'anonymous' };

  constructor(private readonly repository: ResponsibleRepository) {}

  get state(): ResponsibleSessionState {
    return this.#state.status === 'authenticated'
      ? {
          status: 'authenticated',
          responsible: { ...this.#state.responsible },
        }
      : { ...this.#state };
  }

  async enter(candidate: Responsible): Promise<ResponsibleSessionState> {
    this.#state = { status: 'loading' };
    try {
      const responsible = responsibleSchema.parse(candidate);
      const saved = await this.repository.save(responsible);
      this.#state = { status: 'authenticated', responsible: saved };
    } catch {
      this.#state = {
        status: 'error',
        message: 'Não foi possível abrir a área do responsável.',
      };
    }
    return this.state;
  }

  async restore(id: string): Promise<ResponsibleSessionState> {
    this.#state = { status: 'loading' };
    try {
      const responsible = await this.repository.findById(id);
      this.#state = responsible
        ? { status: 'authenticated', responsible }
        : { status: 'anonymous' };
    } catch {
      this.#state = {
        status: 'error',
        message: 'Não foi possível restaurar a área do responsável.',
      };
    }
    return this.state;
  }

  signOut(): ResponsibleSessionState {
    this.#state = { status: 'signedOut' };
    return this.state;
  }
}
