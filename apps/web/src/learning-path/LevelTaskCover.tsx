import type { Activity } from '@fantasia/content';
import type { SequenceDefinition } from '@fantasia/engines';
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

  return (
    <span className="level-task__engine-icon" data-preview-kind="fallback">
      {engineIcons[activity.engine]}
    </span>
  );
}
