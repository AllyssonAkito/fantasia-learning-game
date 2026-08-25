import { useEffect, useMemo, useState } from 'react';
import { feedbackCopyCatalog, mvpAssetById } from '@fantasia/content';
import {
  feedbackForAttempt,
  seededShuffle,
  type FeedbackCue,
} from '@fantasia/engine-core';
import { memoryEngine, type MemoryDefinition } from '@fantasia/engines';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityAsset } from './ActivityAsset';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import type { ActivityScreenProps } from './ActivityScreen';

function assetLabel(id: string) {
  return mvpAssetById.get(id)?.alt ?? id;
}

export function MemoryActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
}: ActivityScreenProps) {
  const definition = activity.content as MemoryDefinition;
  const options = useMemo(
    () =>
      seededShuffle(
        [...new Set(definition.expected)],
        `${activity.id}-memory-options`,
      ),
    [activity.id, definition.expected],
  );
  const [revealed, setRevealed] = useState(true);
  const [revealRound, setRevealRound] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{
    cue: FeedbackCue;
    message: string;
  }>();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setRevealed(false),
      definition.revealMs,
    );
    return () => window.clearTimeout(timer);
  }, [definition.revealMs, revealRound]);

  function choose(id: string) {
    if (complete || revealed) return;
    const next = [...answer, id];
    setAnswer(next);
    if (next.length !== definition.expected.length) return;

    const nextAttempt = attempt + 1;
    const correct = memoryEngine.evaluate(definition, next).correct;
    const cue = feedbackForAttempt(correct, nextAttempt);
    setAttempt(nextAttempt);
    if (correct) {
      setComplete(true);
      setFeedback({ cue, message: feedbackCopyCatalog.completion.activity });
      void audio.playEffect('success');
      return;
    }
    setAnswer([]);
    setRevealed(true);
    setFeedback({
      cue,
      message:
        nextAttempt === 1
          ? feedbackCopyCatalog.attempts.first
          : nextAttempt === 2
            ? feedbackCopyCatalog.attempts.second
            : feedbackCopyCatalog.attempts.third,
    });
    setRevealRound((round) => round + 1);
    void audio.playEffect(nextAttempt >= 2 ? 'hint' : 'attempt');
  }

  return (
    <section className="activity-screen" aria-labelledby="activity-title">
      <button
        aria-label="Voltar"
        className="activity-screen__back"
        onClick={onBack}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
      <h1 className="visually-hidden" id="activity-title">
        {activity.instruction.text}
      </h1>
      <div className="memory-stage" aria-label="Sequência para lembrar">
        {definition.expected.map((id, index) =>
          revealed ? (
            <span key={`${id}-${index}`}>
              <ActivityAsset assetId={id} decorative />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="memory-stage__cover"
              key={`${id}-${index}`}
            />
          ),
        )}
      </div>
      <div className="memory-answer" aria-label="Sua sequência">
        {answer.map((id, index) => (
          <span aria-label={assetLabel(id)} key={`${id}-${index}`}>
            <ActivityAsset assetId={id} decorative />
          </span>
        ))}
      </div>
      <div
        className="activity-screen__options"
        aria-label="Figuras para escolher"
      >
        {options.map((id) => (
          <button
            aria-label={assetLabel(id)}
            disabled={complete || revealed}
            key={id}
            onClick={() => choose(id)}
            type="button"
          >
            <ActivityAsset assetId={id} decorative />
          </button>
        ))}
      </div>
      {feedback ? (
        <ActivityFeedback cue={feedback.cue} message={feedback.message} />
      ) : null}
      <InstructionAudioControl
        autoPlay
        audio={audio}
        instruction={activity.instruction}
      />
      {complete ? (
        <ActivityCompletionOverlay
          coins={activity.reward.coins}
          onContinue={onComplete}
          stars={activity.reward.stars}
        />
      ) : null}
    </section>
  );
}
