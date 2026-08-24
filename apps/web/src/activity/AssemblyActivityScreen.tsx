import { useMemo, useState, type DragEvent } from 'react';
import type { AudioService } from '@fantasia/audio';
import {
  feedbackCopyCatalog,
  mvpAssetById,
  type Activity,
} from '@fantasia/content';
import { feedbackForAttempt, type FeedbackCue } from '@fantasia/engine-core';
import { assemblyEngine, type AssemblyDefinition } from '@fantasia/engines';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';

export interface AssemblyActivityScreenProps {
  activity: Activity;
  audio: AudioService;
  onBack: () => void;
  onComplete: () => void;
}

function pieceLabel(id: string) {
  const asset = mvpAssetById.get(id);
  return asset ? `${asset.source} ${asset.alt}` : id;
}

export function AssemblyActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
}: AssemblyActivityScreenProps) {
  const definition = activity.content as AssemblyDefinition;
  const pieces = useMemo(() => [...definition.pieces].reverse(), [definition]);
  const slots = useMemo(
    () =>
      [...definition.pieces].sort((left, right) => left.order - right.order),
    [definition],
  );
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{
    cue: FeedbackCue;
    message: string;
  }>();
  const [complete, setComplete] = useState(false);

  function place(pieceId: string, slotId: string) {
    if (complete) return;
    const withoutSlot = Object.fromEntries(
      Object.entries(placements).filter(
        ([, currentSlot]) => currentSlot !== slotId,
      ),
    );
    const next = { ...withoutSlot, [pieceId]: slotId };
    setPlacements(next);
    setSelected(undefined);
    if (Object.keys(next).length !== definition.pieces.length) return;

    const nextAttempt = attempt + 1;
    const order = slots.map(
      ({ slotId: orderedSlot }) =>
        Object.entries(next).find(
          ([, currentSlot]) => currentSlot === orderedSlot,
        )?.[0] ?? '',
    );
    const correct = assemblyEngine.evaluate(definition, {
      placements: next,
      order,
    }).correct;
    const cue = feedbackForAttempt(correct, nextAttempt);
    setAttempt(nextAttempt);
    if (correct) {
      setComplete(true);
      setFeedback({ cue, message: feedbackCopyCatalog.completion.activity });
      void audio.playEffect('success');
    } else {
      setFeedback({
        cue,
        message:
          nextAttempt === 1
            ? feedbackCopyCatalog.attempts.first
            : feedbackCopyCatalog.attempts.second,
      });
      setPlacements({});
      void audio.playEffect('attempt');
    }
  }

  function drop(event: DragEvent<HTMLButtonElement>, slotId: string) {
    event.preventDefault();
    const pieceId = event.dataTransfer.getData('text/plain');
    if (pieceId) place(pieceId, slotId);
  }

  const placedIds = new Set(Object.keys(placements));
  return (
    <section className="activity-screen" aria-labelledby="activity-title">
      <button className="activity-screen__back" onClick={onBack} type="button">
        ← Voltar
      </button>
      <h1 id="activity-title">{activity.instruction.text}</h1>
      <InstructionAudioControl
        autoPlay
        audio={audio}
        instruction={activity.instruction}
      />
      <p>Escolha ou arraste uma peça da esquerda para o lugar certo.</p>
      <div className="assembly-board">
        <div className="assembly-board__pieces" aria-label="Peças disponíveis">
          {pieces
            .filter(({ id }) => !placedIds.has(id))
            .map((piece) => (
              <button
                aria-label={pieceLabel(piece.id)}
                aria-pressed={selected === piece.id}
                draggable
                key={piece.id}
                onClick={() => setSelected(piece.id)}
                onDragStart={(event) =>
                  event.dataTransfer.setData('text/plain', piece.id)
                }
                type="button"
              >
                <span aria-hidden="true">
                  {pieceLabel(piece.id).split(' ')[0]}
                </span>
              </button>
            ))}
        </div>
        <div className="assembly-board__slots" aria-label="Lugares da montagem">
          {slots.map((slot, index) => {
            const pieceId = Object.entries(placements).find(
              ([, value]) => value === slot.slotId,
            )?.[0];
            return (
              <button
                aria-label={`Lugar ${index + 1}${pieceId ? `: ${pieceLabel(pieceId)}` : ' vazio'}`}
                key={slot.slotId}
                onClick={() => selected && place(selected, slot.slotId)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, slot.slotId)}
                type="button"
              >
                {pieceId ? pieceLabel(pieceId).split(' ')[0] : index + 1}
              </button>
            );
          })}
        </div>
      </div>
      {feedback ? (
        <ActivityFeedback cue={feedback.cue} message={feedback.message} />
      ) : null}
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
