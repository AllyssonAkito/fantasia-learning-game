import type { ActivitySessionSnapshot } from '@fantasia/engine-core';
import type { MascotState } from './Mascot';

export interface SessionMascotMessages {
  neutral: string;
  instruction: string;
  hints: readonly [string, string, string];
  correct: string;
  error: string;
}

export function mascotReaction(
  session: ActivitySessionSnapshot,
  messages: SessionMascotMessages,
): { state: MascotState; message: string } {
  const hint = () =>
    messages.hints[Math.min(Math.max(session.attempts, 1), 3) - 1]!;
  switch (session.status) {
    case 'presenting':
      return { state: 'instruction', message: messages.instruction };
    case 'hint':
      return { state: 'hint', message: hint() };
    case 'feedback':
      return session.lastEvaluation?.correct
        ? { state: 'celebration', message: messages.correct }
        : { state: 'hint', message: hint() };
    case 'reward':
    case 'complete':
      return { state: 'celebration', message: messages.correct };
    case 'error':
      return { state: 'neutral', message: messages.error };
    case 'idle':
    case 'answering':
      return { state: 'neutral', message: messages.neutral };
  }
}
