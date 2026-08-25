import type { Activity } from '@fantasia/content';
import type {
  ChoiceDefinition,
  ClassificationDefinition,
  MemoryDefinition,
  SequenceDefinition,
} from '@fantasia/engines';
import { ActivityAsset } from '../activity/ActivityAsset';

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

function isPatternsActivity(activity: Activity) {
  return (
    activity.engine === 'sequence' &&
    activity.levelId === 'level.logic.patterns.01'
  );
}

export interface LevelTaskCoverProps {
  activity: Activity;
}

export function LevelTaskCover({ activity }: LevelTaskCoverProps) {
  if (isPatternsActivity(activity)) {
    const definition = activity.content as SequenceDefinition;
    return (
      <span className="level-task__pattern-preview" data-preview-kind="pattern">
        {definition.pattern.slice(0, 3).map((assetId, index) => (
          <span
            className="level-task__pattern-item"
            key={`${assetId}-${index}`}
          >
            <ActivityAsset assetId={assetId} decorative />
          </span>
        ))}
        <span className="level-task__pattern-gap" />
      </span>
    );
  }

  if (activity.levelId === 'level.attention.visual-search.01') {
    const definition = activity.content as ChoiceDefinition;
    return (
      <span
        className="level-task__attention-search"
        data-preview-kind="attention-search"
      >
        {definition.options.map(({ id }) => (
          <span key={id}>
            <ActivityAsset assetId={id} decorative />
          </span>
        ))}
      </span>
    );
  }

  if (activity.levelId === 'level.attention.details.01') {
    const definition = activity.content as MemoryDefinition;
    return (
      <span
        className="level-task__attention-memory"
        data-preview-kind="attention-memory"
      >
        {definition.expected.slice(0, 3).map((assetId, index) => (
          <span key={`${assetId}-${index}`}>
            <ActivityAsset assetId={assetId} decorative />
          </span>
        ))}
        <span className="level-task__attention-memory-hidden" />
      </span>
    );
  }

  if (activity.levelId === 'level.attention.focus.01') {
    const definition = activity.content as ClassificationDefinition;
    return (
      <span
        className="level-task__attention-classification"
        data-preview-kind="attention-classification"
      >
        <span className="level-task__attention-classification-items">
          {Object.keys(definition.assignments)
            .slice(0, 3)
            .map((assetId) => (
              <ActivityAsset assetId={assetId} decorative key={assetId} />
            ))}
        </span>
        <span className="level-task__attention-classification-targets">
          {definition.groups.map(({ id }) => (
            <span key={id}>
              <ActivityAsset assetId={id} decorative />
            </span>
          ))}
        </span>
      </span>
    );
  }

  return (
    <span className="level-task__engine-icon" data-preview-kind="fallback">
      {engineIcons[activity.engine]}
    </span>
  );
}
