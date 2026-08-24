import type { LearningPathView } from '@fantasia/content';

export interface LearningPathProps {
  path: LearningPathView;
}

const stateLabels = {
  completed: 'Concluído',
  current: 'Pronto para brincar',
  locked: 'Bloqueado por enquanto',
} as const;

export function LearningPath({ path }: LearningPathProps) {
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
        {path.stops.map((stop, index) => (
          <button
            aria-label={`${stop.label}. ${stateLabels[stop.state]}`}
            className={`path-stop path-stop--${stop.state}`}
            data-level-id={stop.destinationId}
            disabled={stop.state === 'locked'}
            key={stop.destinationId}
            type="button"
          >
            <span aria-hidden="true" className="path-stop__number">
              {stop.state === 'completed' ? '✓' : index + 1}
            </span>
            <span>{stop.label}</span>
            <small>{stateLabels[stop.state]}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
