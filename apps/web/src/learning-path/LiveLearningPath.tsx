import { buildLearningPathView, type ContentCatalog } from '@fantasia/content';
import { useSyncExternalStore } from 'react';
import { LearningPath } from './LearningPath';
import type { LearningPathProgressStore } from './LearningPathProgressStore';

export interface LiveLearningPathProps {
  catalog: ContentCatalog;
  courseId: string;
  store: LearningPathProgressStore;
  onSelect?: (levelId: string) => void;
  unlockAll?: boolean;
}

export function LiveLearningPath({
  catalog,
  courseId,
  store,
  onSelect,
  unlockAll = false,
}: LiveLearningPathProps) {
  const progress = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return (
    <LearningPath
      onSelect={onSelect}
      path={buildLearningPathView(catalog, courseId, progress)}
      unlockAll={unlockAll}
    />
  );
}
