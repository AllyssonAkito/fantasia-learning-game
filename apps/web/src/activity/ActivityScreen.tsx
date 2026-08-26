import { useMemo, useState, type CSSProperties } from 'react';
import type { AudioService } from '@fantasia/audio';
import type { Activity } from '@fantasia/content';
import { feedbackCopyCatalog } from '@fantasia/content';
import { feedbackForAttempt, type FeedbackCue } from '@fantasia/engine-core';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import { ActivityAsset } from './ActivityAsset';
import {
  CorrectAnswerCelebration,
  type CelebrationOrigin,
} from './CorrectAnswerCelebration';
import { createChoicePresentation } from './activity-presentation';
import { AssemblyActivityScreen } from './AssemblyActivityScreen';
import { MemoryActivityScreen } from './MemoryActivityScreen';
import { PlacementActivityScreen } from './PlacementActivityScreen';
import { ThemedOddOneOutActivityScreen } from './TreeOddOneOutActivityScreen';

const themedOddOneOutActivityIds = new Set(
  Array.from(
    { length: 16 },
    (_, index) =>
      `activity.logic.odd-one-out.${String(index + 1).padStart(3, '0')}`,
  ),
);

const attemptMessages = [
  feedbackCopyCatalog.attempts.first,
  feedbackCopyCatalog.attempts.second,
  feedbackCopyCatalog.attempts.third,
] as const;

export interface ActivityScreenProps {
  activity: Activity;
  audio: AudioService;
  onBack: () => void;
  onComplete: () => void;
}

function ChoiceActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
}: ActivityScreenProps) {
  const presentation = useMemo(
    () => createChoicePresentation(activity),
    [activity],
  );
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{
    cue: FeedbackCue;
    message: string;
  }>();
  const [complete, setComplete] = useState(false);
  const [rewardReady, setRewardReady] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<{
    assetId: string;
    label: string;
    origin?: CelebrationOrigin;
  }>();
  const isOddOneOut = activity.levelId === 'level.logic.odd-one-out.01';

  function answer(optionId: string, source: HTMLButtonElement) {
    if (complete) return;
    const nextAttempt = attempt + 1;
    const correct = presentation.evaluate(optionId);
    const cue = feedbackForAttempt(correct, nextAttempt);
    setAttempt(nextAttempt);
    if (correct) {
      setComplete(true);
      if (isOddOneOut) {
        const option = presentation.options.find(({ id }) => id === optionId)!;
        const rect = source.getBoundingClientRect();
        setCorrectAnswer({
          assetId: option.assetId,
          label: option.label,
          origin:
            rect.width > 0 && rect.height > 0
              ? {
                  height: rect.height,
                  left: rect.left,
                  top: rect.top,
                  width: rect.width,
                }
              : undefined,
        });
      } else {
        setRewardReady(true);
      }
      setFeedback({ cue, message: feedbackCopyCatalog.completion.activity });
      void audio.playEffect('success');
    } else {
      setFeedback({
        cue,
        message: attemptMessages[Math.min(nextAttempt, 3) - 1]!,
      });
      void audio.playEffect(nextAttempt >= 2 ? 'hint' : 'attempt');
    }
  }

  const optionList = (
    <div
      className={`activity-screen__options${presentation.options.length === 4 ? ' activity-screen__options--four' : ''}${isOddOneOut ? ' activity-screen__options--odd-one-out' : ''}`}
      aria-label="Escolha uma resposta"
    >
      {presentation.options.map((option) => (
        <button
          aria-label={option.label}
          disabled={complete}
          key={option.id}
          onClick={(event) => answer(option.id, event.currentTarget)}
          type="button"
        >
          <span
            className={
              option.quantity
                ? 'activity-option-visual activity-option-visual--quantity'
                : 'activity-option-visual'
            }
            style={
              option.scale
                ? ({
                    '--activity-option-scale': option.scale,
                  } as CSSProperties)
                : undefined
            }
          >
            {Array.from({ length: option.quantity ?? 1 }, (_, index) => (
              <ActivityAsset
                assetId={option.assetId}
                decorative
                key={`${option.assetId}-${index}`}
              />
            ))}
          </span>
        </button>
      ))}
    </div>
  );

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
      {presentation.clue ? (
        <div className="activity-screen__discovery-layout">
          {optionList}
          <div
            aria-label={`Pista: parte de ${presentation.clue.label}`}
            className="activity-screen__visual-clue"
            data-focus-x={presentation.clue.focusX}
            data-focus-y={presentation.clue.focusY}
            data-visual-mode="grayscale"
          >
            <ActivityAsset assetId={presentation.clue.assetId} decorative />
          </div>
        </div>
      ) : (
        <>
          {presentation.pattern.length > 0 ? (
            <div
              className="activity-screen__pattern"
              aria-label="Sequência para observar"
            >
              {presentation.pattern.map((item, index) => (
                <span aria-label={item.label} key={`${item.id}-${index}`}>
                  <ActivityAsset assetId={item.id} decorative />
                </span>
              ))}
              <span aria-label="parte que falta">?</span>
            </div>
          ) : (
            <p className="visually-hidden">{presentation.prompt}</p>
          )}
          {optionList}
        </>
      )}
      {feedback ? (
        <ActivityFeedback cue={feedback.cue} message={feedback.message} />
      ) : null}
      <InstructionAudioControl
        autoPlay
        audio={audio}
        instruction={activity.instruction}
      />
      {complete && correctAnswer && !rewardReady ? (
        <CorrectAnswerCelebration
          assetId={correctAnswer.assetId}
          label={correctAnswer.label}
          onFinished={() => setRewardReady(true)}
          origin={correctAnswer.origin}
        />
      ) : null}
      {complete && rewardReady ? (
        <ActivityCompletionOverlay
          coins={activity.reward.coins}
          onContinue={onComplete}
          stars={activity.reward.stars}
        />
      ) : null}
    </section>
  );
}

export function ActivityScreen(props: ActivityScreenProps) {
  if (themedOddOneOutActivityIds.has(props.activity.id)) {
    return <ThemedOddOneOutActivityScreen {...props} />;
  }
  if (props.activity.engine === 'assembly') {
    return <AssemblyActivityScreen {...props} />;
  }
  if (
    props.activity.engine === 'drag' ||
    props.activity.engine === 'association' ||
    props.activity.engine === 'classification'
  ) {
    return <PlacementActivityScreen {...props} />;
  }
  if (props.activity.engine === 'memory') {
    return <MemoryActivityScreen {...props} />;
  }
  return <ChoiceActivityScreen {...props} />;
}
