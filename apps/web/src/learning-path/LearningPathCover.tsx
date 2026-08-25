import type { LearningPathCover as LearningPathCoverModel } from '@fantasia/content';
import { ActivityAsset } from '../activity/ActivityAsset';

export interface LearningPathCoverProps {
  cover?: LearningPathCoverModel;
}

export function LearningPathCover({ cover }: LearningPathCoverProps) {
  if (!cover) {
    return <span className="path-cover path-cover--fallback" />;
  }
  if (cover.kind === 'sequence') {
    return (
      <span className="path-cover path-cover--sequence" data-cover="sequence">
        {cover.assetIds.map((assetId, index) => (
          <span
            className="path-cover__sequence-item"
            key={`${assetId}-${index}`}
          >
            <ActivityAsset assetId={assetId} decorative />
          </span>
        ))}
        <span className="path-cover__sequence-gap" />
      </span>
    );
  }
  if (cover.kind === 'assembly') {
    return (
      <span className="path-cover path-cover--assembly" data-cover="assembly">
        {cover.pieceIds.map((pieceId) => (
          <span className="path-cover__assembly-piece" key={pieceId}>
            <ActivityAsset assetId={pieceId} decorative />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span
      className="path-cover path-cover--clue"
      data-cover="clue"
      data-focus-x={cover.focusX}
      data-focus-y={cover.focusY}
    >
      <ActivityAsset assetId={cover.assetId} decorative />
    </span>
  );
}
