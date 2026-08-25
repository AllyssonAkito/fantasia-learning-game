import {
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
} from 'react';
import type { AudioService } from '@fantasia/audio';
import {
  feedbackCopyCatalog,
  mvpAssetById,
  type Activity,
} from '@fantasia/content';
import {
  feedbackForAttempt,
  seededShuffle,
  type FeedbackCue,
} from '@fantasia/engine-core';
import { assemblyEngine, type AssemblyDefinition } from '@fantasia/engines';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityFeedback } from '../feedback/ActivityFeedback';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import { ActivityAsset } from './ActivityAsset';

export interface AssemblyActivityScreenProps {
  activity: Activity;
  audio: AudioService;
  onBack: () => void;
  onComplete: () => void;
  seed?: string;
}

function pieceLabel(id: string) {
  const asset = mvpAssetById.get(id);
  return asset?.alt ?? id;
}

function slotLabel(slotId: string) {
  if (slotId === 'top') return 'Lugar de cima';
  if (slotId === 'middle') return 'Lugar do meio';
  if (slotId === 'bottom') return 'Lugar de baixo';
  return 'Lugar da montagem';
}

export function AssemblyActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
  seed,
}: AssemblyActivityScreenProps) {
  const definition = activity.content as AssemblyDefinition;
  const sessionSeed = seed ?? activity.id;
  const pieces = useMemo(
    () => seededShuffle(definition.pieces, sessionSeed),
    [definition, sessionSeed],
  );
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
  const [dragPreview, setDragPreview] = useState<{
    pieceId: string;
    x: number;
    y: number;
  }>();
  const pointerDrag = useRef<
    | {
        pieceId: string;
        startX: number;
        startY: number;
      }
    | undefined
  >(undefined);
  const suppressClick = useRef(false);
  const nativeDragPosition = useRef<{ x: number; y: number } | undefined>(
    undefined,
  );

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

  function startPointerDrag(
    event: PointerEvent<HTMLButtonElement>,
    pieceId: string,
  ) {
    pointerDrag.current = {
      pieceId,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePointerDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = pointerDrag.current;
    if (!current) return;
    const distance = Math.hypot(
      event.clientX - current.startX,
      event.clientY - current.startY,
    );
    if (distance < 8) return;
    setDragPreview({
      pieceId: current.pieceId,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function finishPointerDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = pointerDrag.current;
    pointerDrag.current = undefined;
    if (!current) return;
    const moved =
      Math.hypot(
        event.clientX - current.startX,
        event.clientY - current.startY,
      ) >= 8;
    setDragPreview(undefined);
    if (!moved) return;
    suppressClick.current = true;
    const slot = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-assembly-slot]');
    const slotId = slot?.dataset.assemblySlot;
    if (slotId) place(current.pieceId, slotId);
  }

  function finishNativeDrag(
    event: DragEvent<HTMLButtonElement>,
    pieceId: string,
  ) {
    suppressClick.current = true;
    setDragPreview(undefined);
    pointerDrag.current = undefined;
    const position =
      event.clientX || event.clientY
        ? { x: event.clientX, y: event.clientY }
        : nativeDragPosition.current;
    nativeDragPosition.current = undefined;
    if (!position) return;
    const slot = document
      .elementFromPoint(position.x, position.y)
      ?.closest<HTMLElement>('[data-assembly-slot]');
    const slotId = slot?.dataset.assemblySlot;
    if (slotId) place(pieceId, slotId);
  }

  const placedIds = new Set(Object.keys(placements));
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
      <div className="assembly-board" data-feedback={feedback?.cue}>
        <div className="assembly-board__pieces" aria-label="Peças disponíveis">
          {pieces
            .filter(({ id }) => !placedIds.has(id))
            .map((piece) => (
              <button
                aria-label={pieceLabel(piece.id)}
                aria-pressed={selected === piece.id}
                draggable
                key={piece.id}
                onClick={() => {
                  if (suppressClick.current) {
                    suppressClick.current = false;
                    return;
                  }
                  setSelected(piece.id);
                }}
                onDrag={(event) => {
                  if (event.clientX || event.clientY) {
                    nativeDragPosition.current = {
                      x: event.clientX,
                      y: event.clientY,
                    };
                  }
                }}
                onDragEnd={(event) => finishNativeDrag(event, piece.id)}
                onDragStart={(event) => {
                  pointerDrag.current = undefined;
                  setDragPreview(undefined);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', piece.id);
                }}
                onPointerCancel={() => {
                  pointerDrag.current = undefined;
                  setDragPreview(undefined);
                }}
                onPointerDown={(event) => startPointerDrag(event, piece.id)}
                onPointerMove={movePointerDrag}
                onPointerUp={finishPointerDrag}
                type="button"
              >
                <ActivityAsset assetId={piece.id} decorative />
              </button>
            ))}
        </div>
        <div className="assembly-board__slots" aria-label="Lugares da montagem">
          {slots.map((slot) => {
            const pieceId = Object.entries(placements).find(
              ([, value]) => value === slot.slotId,
            )?.[0];
            return (
              <button
                aria-label={`${slotLabel(slot.slotId)}${pieceId ? `: ${pieceLabel(pieceId)}` : ' vazio'}`}
                data-assembly-slot={slot.slotId}
                key={slot.slotId}
                onClick={() => selected && place(selected, slot.slotId)}
                type="button"
              >
                {pieceId ? (
                  <ActivityAsset assetId={pieceId} decorative />
                ) : (
                  <span aria-hidden="true" className="assembly-board__empty" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {dragPreview ? (
        <div
          aria-hidden="true"
          className="assembly-board__drag-preview"
          style={{ left: dragPreview.x, top: dragPreview.y }}
        >
          <ActivityAsset assetId={dragPreview.pieceId} decorative />
        </div>
      ) : null}
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
