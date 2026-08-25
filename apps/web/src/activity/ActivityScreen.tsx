import { useMemo, useState, type CSSProperties } from 'react';
import type { AudioService } from '@fantasia/audio';
import type { Activity } from '@fantasia/content';
import { feedbackCopyCatalog } from '@fantasia/content';
import { feedbackForAttempt, type FeedbackCue } from '@fantasia/engine-core';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import { ActivityAsset } from './ActivityAsset';
import { createChoicePresentation } from './activity-presentation';
import { AssemblyActivityScreen } from './AssemblyActivityScreen';
import { MemoryActivityScreen } from './MemoryActivityScreen';
import { PlacementActivityScreen } from './PlacementActivityScreen';

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

  function answer(optionId: string) {
    if (complete) return;
    const nextAttempt = attempt + 1;
    const correct = presentation.evaluate(optionId);
    const cue = feedbackForAttempt(correct, nextAttempt);
    setAttempt(nextAttempt);
    if (correct) {
      setComplete(true);
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
        <div
          aria-label={`Pista: parte de ${presentation.clue.label}`}
          className="activity-screen__visual-clue"
          data-focus-x={presentation.clue.focusX}
          data-focus-y={presentation.clue.focusY}
        >
          <ActivityAsset assetId={presentation.clue.assetId} decorative />
        </div>
      ) : presentation.pattern.length > 0 ? (
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
      <div
        className="activity-screen__options"
        aria-label="Escolha uma resposta"
      >
        {presentation.options.map((option) => (
          <button
            aria-label={option.label}
            disabled={complete}
            key={option.id}
            onClick={() => answer(option.id)}
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

export function ActivityScreen(props: ActivityScreenProps) {
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
