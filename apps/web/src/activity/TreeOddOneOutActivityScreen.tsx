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
  | 'picnic';

interface OddOneOutScene {
  theme: SceneTheme;
  successLabel: string;
  hidesBehindOption?: boolean;
}

const oddOneOutScenes: Record<string, OddOneOutScene> = {
  'activity.logic.odd-one-out.001': {
    theme: 'trees',
    successLabel:
      'O cachorrinho cresce, brinca e volta a se esconder na árvore.',
    hidesBehindOption: true,
  },
  'activity.logic.odd-one-out.002': {
    theme: 'locks',
    successLabel: 'A chave cresce, gira e abre um cadeado imaginário.',
  },
  'activity.logic.odd-one-out.003': {
    theme: 'space',
    successLabel: 'O planeta amarelo cresce e faz uma volta pelo espaço.',
  },
  'activity.logic.odd-one-out.004': {
    theme: 'ocean',
    successLabel: 'A estrela-do-mar cresce e dança na água.',
  },
  'activity.logic.odd-one-out.005': {
    theme: 'garden',
    successLabel: 'A borboleta cresce, bate as asas e voa.',
  },
  'activity.logic.odd-one-out.006': {
    theme: 'reef',
    successLabel: 'O polvinho azul cresce, acena e mergulha.',
  },
  'activity.logic.odd-one-out.007': {
    theme: 'closet',
    successLabel: 'O chapéu cresce, gira e faz uma reverência.',
  },
  'activity.logic.odd-one-out.008': {
    theme: 'playground',
    successLabel: 'O alvo cresce e suas cores pulsam.',
  },
  'activity.logic.odd-one-out.009': {
    theme: 'breeze',
    successLabel: 'O guarda-chuva cresce, abre e gira com a brisa.',
  },
  'activity.logic.odd-one-out.010': {
    theme: 'tea',
    successLabel: 'O coco cresce, balança e dá um pulinho.',
  },
  'activity.logic.odd-one-out.011': {
    theme: 'music',
    successLabel: 'A raquete cresce e rebate uma bolinha imaginária.',
  },
  'activity.logic.odd-one-out.012': {
    theme: 'picnic',
    successLabel: 'A lata cresce, gira e balança como um chocalho.',
  },
};

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
  const scene = oddOneOutScenes[activity.id]!;
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
          aria-label={scene.successLabel}
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
