import { useState } from 'react';
import type { ContentCatalog } from '@fantasia/content';
import type { TelemetryEvent } from '@fantasia/telemetry';
import type { AudioService } from '@fantasia/audio';
import { ActivityScreen } from '../activity/ActivityScreen';
import { AdultGate } from '../adult/AdultGate';
import {
  ResponsibleArea,
  type ResponsibleProfile,
} from '../adult/ResponsibleArea';
import { LiveLearningPath } from '../learning-path/LiveLearningPath';
import type { LearningPathProgressStore } from '../learning-path/LearningPathProgressStore';
import { AppShell } from './AppShell';

export interface FantasiaAppProps {
  catalog: ContentCatalog;
  progressStore: LearningPathProgressStore;
  profiles: readonly ResponsibleProfile[];
  telemetryEvents?: readonly TelemetryEvent[];
  audio: AudioService;
}

export function FantasiaApp({
  catalog,
  progressStore,
  profiles,
  telemetryEvents = [],
  audio,
}: FantasiaAppProps) {
  const [adultAreaOpen, setAdultAreaOpen] = useState(false);
  const [levelId, setLevelId] = useState<string>();
  const activity = levelId
    ? catalog.getActivitiesByLevel(levelId)[0]
    : undefined;

  const nextLevel = (completedLevelId: string) => {
    const levels = catalog
      .getTrailsByCourse('course.logic')
      .flatMap((trail) => catalog.getSkillsByTrail(trail.id))
      .flatMap((skill) => catalog.getLevelsBySkill(skill.id));
    const index = levels.findIndex(({ id }) => id === completedLevelId);
    return levels[index + 1]?.id;
  };
  return (
    <>
      <AppShell
        adultAccess={<AdultGate onUnlock={() => setAdultAreaOpen(true)} />}
        state={{
          status: 'ready',
          content:
            activity && levelId ? (
              <ActivityScreen
                activity={activity}
                audio={audio}
                onBack={() => setLevelId(undefined)}
                onComplete={() => {
                  progressStore.completeLevel(levelId, nextLevel(levelId));
                  setLevelId(undefined);
                }}
              />
            ) : (
              <LiveLearningPath
                catalog={catalog}
                courseId="course.logic"
                onSelect={setLevelId}
                store={progressStore}
              />
            ),
        }}
      />
      {adultAreaOpen ? (
        <ResponsibleArea
          events={telemetryEvents}
          onClose={() => setAdultAreaOpen(false)}
          profiles={profiles}
        />
      ) : null}
    </>
  );
}
