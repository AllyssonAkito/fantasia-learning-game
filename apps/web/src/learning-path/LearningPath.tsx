import type { LearningPathView } from '@fantasia/content';

export interface LearningPathProps {
  path: LearningPathView;
  onSelect?: (levelId: string) => void;
  unlockAll?: boolean;
}

const stateLabels = {
  completed: 'Concluído',
  current: 'Pronto para brincar',
  locked: 'Bloqueado por enquanto',
} as const;

export function LearningPath({
  path,
  onSelect,
  unlockAll = false,
}: LearningPathProps) {
  if (path.status === 'empty') {
    return (
      <section aria-live="polite" className="path-empty" role="status">
        <span aria-hidden="true">🌱</span>
        <h1>Novas aventuras estão chegando</h1>
      </section>
    );
  }

  return (
    <section aria-labelledby="learning-path-title" className="learning-path">
      <p className="learning-path__eyebrow">Sua aventura</p>
      <h1 id="learning-path-title">{path.courseLabel}</h1>
      <div aria-label="Caminho de atividades" className="learning-path__stops">
        {path.stops.map((stop, index) => {
          const visualState =
            unlockAll && stop.state === 'locked' ? 'current' : stop.state;
          return (
            <button
              aria-label={`${stop.label}. ${stateLabels[visualState]}`}
              className={`path-stop path-stop--${visualState}`}
              data-level-id={stop.destinationId}
              disabled={visualState === 'locked'}
              key={stop.destinationId}
              onClick={() => onSelect?.(stop.destinationId)}
              type="button"
            >
              <span aria-hidden="true" className="path-stop__number">
                {stop.state === 'completed' ? '✓' : index + 1}
              </span>
              <span>{stop.label}</span>
              <small>{stateLabels[visualState]}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
