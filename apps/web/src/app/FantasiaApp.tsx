import { useState } from 'react';
import type { ContentCatalog } from '@fantasia/content';
import type { TelemetryEvent } from '@fantasia/telemetry';
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
}

export function FantasiaApp({
  catalog,
  progressStore,
  profiles,
  telemetryEvents = [],
}: FantasiaAppProps) {
  const [adultAreaOpen, setAdultAreaOpen] = useState(false);
  return (
    <>
      <AppShell
        adultAccess={<AdultGate onUnlock={() => setAdultAreaOpen(true)} />}
        state={{
          status: 'ready',
          content: (
            <LiveLearningPath
              catalog={catalog}
              courseId="course.logic"
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
