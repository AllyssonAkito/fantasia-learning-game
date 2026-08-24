import { buildLearningPathView, type ContentCatalog } from '@fantasia/content';
import { useSyncExternalStore } from 'react';
import { LearningPath } from './LearningPath';
import type { LearningPathProgressStore } from './LearningPathProgressStore';

export interface LiveLearningPathProps {
  catalog: ContentCatalog;
  courseId: string;
  store: LearningPathProgressStore;
}

export function LiveLearningPath({
  catalog,
  courseId,
  store,
}: LiveLearningPathProps) {
  const progress = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return (
    <LearningPath path={buildLearningPathView(catalog, courseId, progress)} />
  );
}
