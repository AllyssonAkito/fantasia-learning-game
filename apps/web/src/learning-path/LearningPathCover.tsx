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
  if (cover.kind === 'search') {
    return (
      <span className="path-cover path-cover--search" data-cover="search">
        {cover.assetIds.map((assetId) => (
          <span className="path-cover__search-item" key={assetId}>
            <ActivityAsset assetId={assetId} decorative />
          </span>
        ))}
      </span>
    );
  }
  if (cover.kind === 'memory') {
    return (
      <span className="path-cover path-cover--memory" data-cover="memory">
        {cover.assetIds.map((assetId, index) => (
          <span className="path-cover__memory-item" key={`${assetId}-${index}`}>
            <ActivityAsset assetId={assetId} decorative />
          </span>
        ))}
        <span className="path-cover__memory-hidden" />
      </span>
    );
  }
  if (cover.kind === 'classification') {
    return (
      <span
        className="path-cover path-cover--classification"
        data-cover="classification"
      >
        <span className="path-cover__classification-items">
          {cover.itemIds.map((assetId) => (
            <ActivityAsset assetId={assetId} decorative key={assetId} />
          ))}
        </span>
        <span className="path-cover__classification-targets">
          {cover.targetIds.map((assetId) => (
            <span key={assetId}>
              <ActivityAsset assetId={assetId} decorative />
            </span>
          ))}
        </span>
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
