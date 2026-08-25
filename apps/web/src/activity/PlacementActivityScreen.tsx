import { useMemo, useState, type DragEvent } from 'react';
import {
  feedbackCopyCatalog,
  mvpAssetById,
  type Activity,
} from '@fantasia/content';
import { feedbackForAttempt, type FeedbackCue } from '@fantasia/engine-core';
import {
  associationEngine,
  classificationEngine,
  dragEngine,
  type AssociationDefinition,
  type ClassificationDefinition,
  type DragDefinition,
} from '@fantasia/engines';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityAsset } from './ActivityAsset';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import type { ActivityScreenProps } from './ActivityScreen';

interface PlacementModel {
  items: string[];
  targets: { id: string; label: string }[];
  allowsSharedTarget: boolean;
  evaluate: (
    placements: Record<string, string>,
    interaction: 'drag' | 'select',
  ) => boolean;
}

function assetLabel(id: string) {
  return mvpAssetById.get(id)?.alt ?? id;
}

function createPlacementModel(activity: Activity): PlacementModel {
  if (activity.engine === 'drag') {
    const definition = activity.content as DragDefinition;
    return {
      items: definition.items.map(({ id }) => id),
      targets: definition.targets,
      allowsSharedTarget: false,
      evaluate: (placements, interaction) =>
        dragEngine.evaluate(definition, { placements, interaction }).correct,
    };
  }
  if (activity.engine === 'association') {
    const definition = activity.content as AssociationDefinition;
    return {
      items: Object.keys(definition.relations),
      targets: [...new Set(Object.values(definition.relations))].map((id) => ({
        id,
        label: assetLabel(id),
      })),
      allowsSharedTarget: definition.mode === 'category',
      evaluate: (placements) =>
        associationEngine.evaluate(definition, placements).correct,
    };
  }
  const definition = activity.content as ClassificationDefinition;
  return {
    items: Object.keys(definition.assignments),
    targets: definition.groups,
    allowsSharedTarget: true,
    evaluate: (placements) =>
      classificationEngine.evaluate(definition, placements).correct,
  };
}

export function PlacementActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
}: ActivityScreenProps) {
  const model = useMemo(() => createPlacementModel(activity), [activity]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{
    cue: FeedbackCue;
    message: string;
  }>();
  const [complete, setComplete] = useState(false);

  function place(
    itemId: string,
    targetId: string,
    interaction: 'drag' | 'select',
  ) {
    if (complete) return;
    const available = Object.fromEntries(
      Object.entries(placements).filter(
        ([, currentTarget]) =>
          model.allowsSharedTarget || currentTarget !== targetId,
      ),
    );
    const next = { ...available, [itemId]: targetId };
    setPlacements(next);
    setSelected(undefined);
    if (Object.keys(next).length !== model.items.length) return;

    const nextAttempt = attempt + 1;
    const correct = model.evaluate(next, interaction);
    const cue = feedbackForAttempt(correct, nextAttempt);
    setAttempt(nextAttempt);
    if (correct) {
      setComplete(true);
      setFeedback({ cue, message: feedbackCopyCatalog.completion.activity });
      void audio.playEffect('success');
      return;
    }
    setFeedback({
      cue,
      message:
        nextAttempt === 1
          ? feedbackCopyCatalog.attempts.first
          : nextAttempt === 2
            ? feedbackCopyCatalog.attempts.second
            : feedbackCopyCatalog.attempts.third,
    });
    setPlacements({});
    void audio.playEffect(nextAttempt >= 2 ? 'hint' : 'attempt');
  }

  function drop(event: DragEvent<HTMLButtonElement>, targetId: string) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain');
    if (itemId) place(itemId, targetId, 'drag');
  }

  const placed = new Set(Object.keys(placements));
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
      <div className="placement-board" data-feedback={feedback?.cue}>
        <div className="placement-board__items" aria-label="Figuras para mover">
          {model.items
            .filter((id) => !placed.has(id))
            .map((id) => (
              <button
                aria-label={assetLabel(id)}
                aria-pressed={selected === id}
                draggable
                key={id}
                onClick={() => setSelected(id)}
                onDragStart={(event) =>
                  event.dataTransfer.setData('text/plain', id)
                }
                type="button"
              >
                <ActivityAsset assetId={id} decorative />
              </button>
            ))}
        </div>
        <div className="placement-board__targets" aria-label="Destinos">
          {model.targets.map((target) => {
            const targetItems = Object.entries(placements)
              .filter(([, targetId]) => targetId === target.id)
              .map(([itemId]) => itemId);
            return (
              <button
                aria-label={`${target.label}${targetItems.length > 0 ? `: ${targetItems.map(assetLabel).join(', ')}` : ' vazio'}`}
                data-placement-target={target.id}
                key={target.id}
                onClick={() => selected && place(selected, target.id, 'select')}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, target.id)}
                type="button"
              >
                {mvpAssetById.has(target.id) ? (
                  <ActivityAsset assetId={target.id} decorative />
                ) : null}
                <span className="placement-board__placed" aria-hidden="true">
                  {targetItems.map((itemId) => (
                    <ActivityAsset assetId={itemId} decorative key={itemId} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
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
