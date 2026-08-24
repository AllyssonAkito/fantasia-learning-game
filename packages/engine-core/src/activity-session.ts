export type ActivitySessionStatus =
  | 'idle'
  | 'presenting'
  | 'answering'
  | 'feedback'
  | 'hint'
  | 'reward'
  | 'complete'
  | 'error';
export interface SessionEvaluation {
  correct: boolean;
}
export interface ActivitySessionSnapshot {
  status: ActivitySessionStatus;
  attempts: number;
  completionCount: number;
  lastEvaluation?: SessionEvaluation;
  errorMessage?: string;
}

export class ActivitySession {
  #snapshot: ActivitySessionSnapshot = {
    status: 'idle',
    attempts: 0,
    completionCount: 0,
  };
  get snapshot(): ActivitySessionSnapshot {
    return {
      ...this.#snapshot,
      lastEvaluation: this.#snapshot.lastEvaluation
        ? { ...this.#snapshot.lastEvaluation }
        : undefined,
    };
  }
  start() {
    this.#expect('idle');
    this.#snapshot.status = 'presenting';
    return this.snapshot;
  }
  ready() {
    this.#expect('presenting', 'hint');
    this.#snapshot.status = 'answering';
    return this.snapshot;
  }
  evaluate(evaluation: SessionEvaluation) {
    this.#expect('answering');
    this.#snapshot = {
      ...this.#snapshot,
      status: 'feedback',
      attempts: this.#snapshot.attempts + 1,
      lastEvaluation: { ...evaluation },
    };
    return this.snapshot;
  }
  continue() {
    this.#expect('feedback');
    this.#snapshot.status = this.#snapshot.lastEvaluation?.correct
      ? 'reward'
      : 'hint';
    return this.snapshot;
  }
  finishReward() {
    this.#expect('reward');
    this.#snapshot = {
      ...this.#snapshot,
      status: 'complete',
      completionCount: this.#snapshot.completionCount + 1,
    };
    return this.snapshot;
  }
  fail(message: string) {
    if (this.#snapshot.status === 'complete')
      throw new Error('Uma sessão concluída não pode entrar em erro.');
    this.#snapshot = {
      ...this.#snapshot,
      status: 'error',
      errorMessage: message,
    };
    return this.snapshot;
  }
  reset() {
    this.#expect('error');
    this.#snapshot = { status: 'idle', attempts: 0, completionCount: 0 };
    return this.snapshot;
  }
  #expect(...allowed: ActivitySessionStatus[]) {
    if (!allowed.includes(this.#snapshot.status))
      throw new Error(
        `Transição inválida a partir de ${this.#snapshot.status}; esperado: ${allowed.join(', ')}`,
      );
  }
}
