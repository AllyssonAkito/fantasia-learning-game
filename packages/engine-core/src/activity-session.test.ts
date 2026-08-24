import { describe, expect, it } from 'vitest';
import { ActivitySession } from './activity-session';

describe('ActivitySession', () => {
  it('percorre acerto até conclusão exatamente uma vez', () => {
    const session = new ActivitySession();
    expect(session.start().status).toBe('presenting');
    expect(session.ready().status).toBe('answering');
    expect(session.evaluate({ correct: true })).toMatchObject({
      status: 'feedback',
      attempts: 1,
    });
    expect(session.continue().status).toBe('reward');
    expect(session.finishReward()).toMatchObject({
      status: 'complete',
      completionCount: 1,
    });
    expect(() => session.finishReward()).toThrow('Transição inválida');
  });
  it('leva erro para dica e permite nova tentativa', () => {
    const session = new ActivitySession();
    session.start();
    session.ready();
    session.evaluate({ correct: false });
    expect(session.continue().status).toBe('hint');
    expect(session.ready().status).toBe('answering');
    expect(session.snapshot.attempts).toBe(1);
  });
  it('impede submissão fora do estado de resposta', () => {
    expect(() => new ActivitySession().evaluate({ correct: true })).toThrow(
      'Transição inválida',
    );
  });
  it('oferece estado de erro recuperável', () => {
    const session = new ActivitySession();
    session.start();
    expect(session.fail('Áudio indisponível')).toMatchObject({
      status: 'error',
      errorMessage: 'Áudio indisponível',
    });
    expect(session.reset()).toMatchObject({
      status: 'idle',
      attempts: 0,
      completionCount: 0,
    });
  });
});
