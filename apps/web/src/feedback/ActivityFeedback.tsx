import type { FeedbackCue } from '@fantasia/engine-core';
import { useEffect } from 'react';

export interface ActivityFeedbackProps {
  cue: FeedbackCue;
  message: string;
  onSound?: (soundCueId: FeedbackCue['soundCueId']) => void;
}

export function ActivityFeedback({
  cue,
  message,
  onSound,
}: ActivityFeedbackProps) {
  useEffect(() => {
    onSound?.(cue.soundCueId);
  }, [cue.soundCueId, onSound]);
  return (
    <output
      aria-live="polite"
      className={`activity-feedback activity-feedback--${cue.visual}`}
      data-blocks-flow="false"
    >
      <span aria-hidden="true" className="activity-feedback__mark">
        {cue.kind === 'correct' ? '✓' : cue.hintLevel === 3 ? '!' : '↻'}
      </span>
      {message}
    </output>
  );
}
