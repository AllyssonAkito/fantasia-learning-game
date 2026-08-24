import { feedbackForAttempt } from '@fantasia/engine-core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFeedback } from './ActivityFeedback';

describe('ActivityFeedback', () => {
  it('emite som e texto de acerto sem bloquear a sessão', () => {
    const onSound = vi.fn();
    render(
      <ActivityFeedback
        cue={feedbackForAttempt(true, 1)}
        message="Muito bem!"
        onSound={onSound}
      />,
    );
    expect(screen.getByText(/Muito bem!/)).toHaveAttribute(
      'data-blocks-flow',
      'false',
    );
    expect(onSound).toHaveBeenCalledWith('sfx.correct');
  });

  it('mostra orientação da terceira tentativa sem linguagem punitiva', () => {
    render(
      <ActivityFeedback
        cue={feedbackForAttempt(false, 3)}
        message="Veja como podemos fazer."
      />,
    );
    expect(screen.getByText(/Veja como podemos fazer/)).toBeVisible();
  });
});
