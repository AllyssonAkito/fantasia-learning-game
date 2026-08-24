import type { ActivitySessionSnapshot } from '@fantasia/engine-core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mascotReaction } from './mascot-reaction';
import { SessionMascot } from './SessionMascot';

const messages = {
  neutral: 'Estou aqui.',
  instruction: 'Toque na letra.',
  hints: [
    'Tente de novo.',
    'Veja a luz.',
    'Escolha entre estas duas.',
  ] as const,
  correct: 'Muito bem!',
  error: 'Vamos fazer uma pausa.',
};

const session = (
  status: ActivitySessionSnapshot['status'],
  attempts = 0,
  correct?: boolean,
): ActivitySessionSnapshot => ({
  status,
  attempts,
  completionCount: status === 'complete' ? 1 : 0,
  lastEvaluation: correct === undefined ? undefined : { correct },
});

describe('SessionMascot', () => {
  it('reage aos estados padronizados da sessão', () => {
    expect(mascotReaction(session('presenting'), messages).state).toBe(
      'instruction',
    );
    expect(mascotReaction(session('feedback', 1, false), messages)).toEqual({
      state: 'hint',
      message: 'Tente de novo.',
    });
    expect(mascotReaction(session('complete', 1, true), messages).state).toBe(
      'celebration',
    );
  });

  it('mantém mensagem e estado com movimento reduzido', () => {
    render(
      <SessionMascot
        avatarId="avatar.dog"
        messages={messages}
        reducedMotion
        session={session('hint', 3, false)}
      />,
    );
    expect(screen.getByLabelText(/Cachorrinho/)).toHaveAttribute(
      'data-motion',
      'reduced',
    );
    expect(screen.getByText('Escolha entre estas duas.')).toBeVisible();
  });
});
