import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InstructionAudioControl } from '../audio/InstructionAudioControl';
import { ActivityAsset } from './ActivityAsset';
import { ActivityCompletionOverlay } from './ActivityCompletionOverlay';
import { createChoicePresentation } from './activity-presentation';
import type { ActivityScreenProps } from './ActivityScreen';

type ScenePhase =
  | 'revealing'
  | 'ready'
  | 'wrong'
  | 'growing'
  | 'celebrating'
  | 'hiding'
  | 'reward';

type SceneTheme =
  | 'trees'
  | 'locks'
  | 'space'
  | 'ocean'
  | 'garden'
  | 'reef'
  | 'closet'
  | 'playground'
  | 'breeze'
  | 'tea'
  | 'music'
  | 'picnic'
  | 'workshop'
  | 'library'
  | 'meadow'
  | 'coast';

interface OddOneOutScene {
  theme: SceneTheme;
  hidesBehindOption?: boolean;
}

const oddOneOutScenes: readonly OddOneOutScene[] = [
  { theme: 'trees', hidesBehindOption: true },
  { theme: 'locks' },
  { theme: 'space' },
  { theme: 'ocean' },
  { theme: 'garden' },
  { theme: 'reef' },
  { theme: 'closet' },
  { theme: 'playground' },
  { theme: 'breeze' },
  { theme: 'tea' },
  { theme: 'music' },
  { theme: 'picnic' },
  { theme: 'workshop' },
  { theme: 'library' },
  { theme: 'meadow' },
  { theme: 'coast' },
];

const revealStepMs = 260;
const wrongReactionMs = 520;
const growMs = 850;
const celebrateMs = 560;
const hideMs = 680;

function reducedMotionPreferred() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function ThemedOddOneOutActivityScreen({
  activity,
  audio,
  onBack,
  onComplete,
}: ActivityScreenProps) {
  const presentation = useMemo(
    () => createChoicePresentation(activity),
    [activity],
  );
  const [phase, setPhase] = useState<ScenePhase>('revealing');
  const [visibleCount, setVisibleCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const timers = useRef<number[]>([]);
  const reducedMotion = reducedMotionPreferred();
  const scene = oddOneOutScenes[Number(activity.id.slice(-3)) - 1]!;
  const correctOption = presentation.options.find(({ id }) =>
    presentation.evaluate(id),
  )!;
  const coverOption = scene.hidesBehindOption
    ? presentation.options.find(({ id }) => !presentation.evaluate(id))
    : undefined;
  const successActive =
    phase === 'growing' || phase === 'celebrating' || phase === 'hiding';

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }, []);

  useEffect(() => {
    const step = reducedMotion ? 20 : revealStepMs;
    presentation.options.forEach((_, index) => {
      schedule(
        () => {
          setVisibleCount(index + 1);
          void audio.playEffect('reveal');
          if (index === presentation.options.length - 1) setPhase('ready');
        },
        step * (index + 1),
      );
    });
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [audio, presentation.options, reducedMotion, schedule]);

  useEffect(() => {
    if (!successActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [successActive]);

  function answer(optionId: string) {
    if (phase !== 'ready') return;
    if (!presentation.evaluate(optionId)) {
      setAnnouncement('Vamos tentar de novo.');
      setPhase('wrong');
      void audio.playEffect('wrong-rumble');
      schedule(() => setPhase('ready'), reducedMotion ? 70 : wrongReactionMs);
      return;
    }

    setAnnouncement(`Muito bem! ${correctOption.label} não encaixa.`);
    setPhase('growing');
    void audio.playEffect('success');
    const firstDuration = reducedMotion ? 70 : growMs;
    const secondDuration = reducedMotion ? 60 : celebrateMs;
    const thirdDuration = reducedMotion ? 70 : hideMs;
    schedule(() => setPhase('celebrating'), firstDuration);
    schedule(() => setPhase('hiding'), firstDuration + secondDuration);
    schedule(
      () => setPhase('reward'),
      firstDuration + secondDuration + thirdDuration,
    );
  }

  return (
    <section
      aria-labelledby="activity-title"
      className="tree-odd-one-out odd-one-out-scene"
      data-phase={phase}
      data-theme={scene.theme}
    >
      <button
        aria-label="Voltar"
        className="activity-screen__back tree-odd-one-out__back"
        onClick={onBack}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
      <h1 className="visually-hidden" id="activity-title">
        {activity.instruction.text}
      </h1>
      <div
        aria-label="Escolha a figura que não combina"
        className="tree-odd-one-out__pieces"
        role="group"
      >
        {presentation.options.map((option, index) => (
          <button
            aria-label={option.label}
            data-dismissing={successActive && option.id !== correctOption.id}
            data-visible={index < visibleCount}
            disabled={phase !== 'ready'}
            key={option.id}
            onClick={() => answer(option.id)}
            type="button"
          >
            <ActivityAsset assetId={option.assetId} decorative />
          </button>
        ))}
      </div>
      <InstructionAudioControl
        autoPlay
        audio={audio}
        instruction={activity.instruction}
      />
      <span aria-live="assertive" className="visually-hidden" role="status">
        {announcement}
      </span>
      {successActive ? (
        <div
          aria-label={`${correctOption.label} cresce e se anima antes da recompensa.`}
          aria-live="assertive"
          className="tree-success"
          data-phase={phase}
          data-theme={scene.theme}
          role="status"
        >
          <div aria-hidden="true" className="tree-success__visual">
            <span className="tree-success__puppy">
              <ActivityAsset assetId={correctOption.assetId} decorative />
            </span>
            {coverOption ? (
              <span className="tree-success__cover">
                <ActivityAsset assetId={coverOption.assetId} decorative />
              </span>
            ) : null}
          </div>
          <span aria-hidden="true" className="tree-success__sparkles" />
        </div>
      ) : null}
      {phase === 'reward' ? (
        <ActivityCompletionOverlay
          coins={activity.reward.coins}
          onContinue={onComplete}
          stars={activity.reward.stars}
        />
      ) : null}
    </section>
  );
}
