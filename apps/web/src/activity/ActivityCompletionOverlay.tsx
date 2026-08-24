import { useEffect, useRef } from 'react';
import { RewardCelebration } from '../rewards/RewardCelebration';

export interface ActivityCompletionOverlayProps {
  coins: number;
  stars: number;
  onContinue: () => void;
}

export function ActivityCompletionOverlay({
  coins,
  stars,
  onContinue,
}: ActivityCompletionOverlayProps) {
  const continueButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    continueButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="activity-completion-overlay">
      <div
        aria-labelledby="activity-completion-title"
        aria-modal="true"
        className="activity-completion-overlay__dialog"
        role="dialog"
      >
        <RewardCelebration
          coins={coins}
          headingId="activity-completion-title"
          stars={stars}
        />
        <button
          className="primary-action"
          onClick={onContinue}
          ref={continueButton}
          type="button"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
