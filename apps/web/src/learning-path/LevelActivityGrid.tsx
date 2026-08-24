import { useSyncExternalStore } from 'react';
import type { Activity } from '@fantasia/content';
import type { LearningPathProgressStore } from './LearningPathProgressStore';

const engineIcons = {
  choice: '🔎',
  drag: '☝️',
  sequence: '🧩',
  association: '🤝',
  classification: '🧺',
  memory: '🧠',
  comparison: '⚖️',
  assembly: '🧸',
} as const;

export interface LevelActivityGridProps {
  activities: readonly Activity[];
  onBack: () => void;
  onSelect: (activityId: string) => void;
  store: LearningPathProgressStore;
}

export function LevelActivityGrid({
  activities,
  onBack,
  onSelect,
  store,
}: LevelActivityGridProps) {
  const progress = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  const completed = progress.completedActivityIds ?? new Set<string>();
  const currentIndex = activities.findIndex(({ id }) => !completed.has(id));

  return (
    <section aria-labelledby="level-activities-title" className="level-grid">
      <button className="level-grid__back" onClick={onBack} type="button">
        ← Voltar para a trilha
      </button>
      <div
        className="level-grid__count"
        aria-label={`${activities.length} atividades`}
      >
        <strong>{activities.length}</strong>
        <span>atividades</span>
      </div>
      <h1 id="level-activities-title">Escolha a próxima brincadeira</h1>
      <div aria-label="Tarefas deste nível" className="level-grid__tasks">
        {activities.map((activity, index) => {
          const isCompleted = completed.has(activity.id);
          const isCurrent = index === currentIndex;
          const isLocked = currentIndex >= 0 && index > currentIndex;
          const state = isCompleted
            ? 'Concluída'
            : isCurrent
              ? 'Pronta para brincar'
              : 'Bloqueada por enquanto';

          return (
            <button
              aria-label={`Atividade ${index + 1}. ${activity.title}. ${state}`}
              className={`level-task level-task--${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}`}
              data-activity-id={activity.id}
              disabled={isLocked}
              key={activity.id}
              onClick={() => onSelect(activity.id)}
              type="button"
            >
              <span aria-hidden="true" className="level-task__picture">
                {engineIcons[activity.engine]}
              </span>
              <span className="level-task__title">Tarefa {index + 1}</span>
              <small>{state}</small>
              {isCompleted ? (
                <span aria-hidden="true" className="level-task__check">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
