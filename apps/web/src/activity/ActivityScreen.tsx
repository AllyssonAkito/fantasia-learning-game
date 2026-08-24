import { useMemo, useState } from 'react';
import type { AudioService } from '@fantasia/audio';
import type { Activity } from '@fantasia/content';
import { feedbackCopyCatalog } from '@fantasia/content';
import { feedbackForAttempt, type FeedbackCue } from '@fantasia/engine-core';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import { createChoicePresentation } from './activity-presentation';
import { AssemblyActivityScreen } from './AssemblyActivityScreen';

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
      {presentation.pattern.length > 0 ? (
        <div
          className="activity-screen__pattern"
          aria-label="Sequência para observar"
        >
          {presentation.pattern.map((item, index) => (
            <span key={`${item}-${index}`}>{item.split(' ')[0]}</span>
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
            <span aria-hidden="true">{option.label.split(' ')[0]}</span>
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
  return props.activity.engine === 'assembly' ? (
    <AssemblyActivityScreen {...props} />
  ) : (
    <ChoiceActivityScreen {...props} />
  );
}
