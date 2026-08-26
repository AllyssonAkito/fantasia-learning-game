import { useEffect, useRef, type CSSProperties } from 'react';
import { ActivityAsset } from './ActivityAsset';

export interface CelebrationOrigin {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface CorrectAnswerCelebrationProps {
  assetId: string;
  label: string;
  origin?: CelebrationOrigin;
  onFinished: () => void;
}

export function CorrectAnswerCelebration({
  assetId,
  label,
  origin,
  onFinished,
}: CorrectAnswerCelebrationProps) {
  const onFinishedRef = useRef(onFinished);
  const completionDuration =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 80
      : 1100;

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const completionTimer = window.setTimeout(
      () => onFinishedRef.current(),
      completionDuration,
    );
    return () => {
      window.clearTimeout(completionTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [completionDuration]);

  const style = origin
    ? ({
        '--celebration-origin-height': `${origin.height}px`,
        '--celebration-origin-left': `${origin.left}px`,
        '--celebration-origin-top': `${origin.top}px`,
        '--celebration-origin-width': `${origin.width}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      aria-label={`Muito bem! ${label} é a resposta.`}
      aria-live="assertive"
      className="correct-answer-celebration"
      role="status"
    >
      <div
        aria-hidden="true"
        className="correct-answer-celebration__confetti"
      />
      <div
        aria-hidden="true"
        className="correct-answer-celebration__visual"
        data-asset-id={assetId}
        data-duration-ms={completionDuration}
        style={style}
      >
        <ActivityAsset assetId={assetId} decorative />
      </div>
    </div>
  );
}
