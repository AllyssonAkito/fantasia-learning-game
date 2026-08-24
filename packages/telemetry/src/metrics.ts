import type { TelemetryEvent } from './events';

export interface AreaMetric {
  area: string;
  completed: number;
  attempts: number;
  hints: number;
  averageAttempts: number;
}

export interface MvpMetrics {
  sessions: number;
  completionRate: number;
  activitiesCompleted: number;
  medianActivityMs: number;
  averageAttemptsToComplete: number;
  hintsByLevel: Record<1 | 2 | 3, number>;
  abandonmentByEngine: Record<string, number>;
  audioRepeats: number;
  activeDays: number;
  runtimeErrorsPerSession: number;
  areas: AreaMetric[];
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0
    ? (ordered[middle - 1]! + ordered[middle]!) / 2
    : ordered[middle]!;
}

export function aggregateMvpMetrics(
  events: readonly TelemetryEvent[],
): MvpMetrics {
  const sessions = new Set(events.map(({ sessionId }) => sessionId));
  const started = events.filter(({ event }) => event === 'activity_started');
  const completed = events.filter(
    ({ event }) => event === 'activity_completed',
  );
  const answers = events.filter(({ event }) => event === 'answer_submitted');
  const hints = events.filter(({ event }) => event === 'hint_shown');
  const abandoned = events.filter(
    ({ event }) => event === 'activity_abandoned',
  );
  const areaNames = new Set(
    events.flatMap((event) => event.activityId?.split('.')[1] ?? []),
  );

  const areas = [...areaNames].sort().map((area) => {
    const inArea = (event: TelemetryEvent) =>
      event.activityId?.split('.')[1] === area;
    const areaCompleted = completed.filter(inArea).length;
    const areaAnswers = answers.filter(inArea).length;
    return {
      area,
      completed: areaCompleted,
      attempts: areaAnswers,
      hints: hints.filter(inArea).length,
      averageAttempts: areaCompleted === 0 ? 0 : areaAnswers / areaCompleted,
    };
  });

  return {
    sessions: sessions.size,
    completionRate:
      started.length === 0 ? 0 : completed.length / started.length,
    activitiesCompleted: completed.length,
    medianActivityMs: median(
      completed.flatMap((event) => event.elapsedMs ?? []),
    ),
    averageAttemptsToComplete:
      completed.length === 0 ? 0 : answers.length / completed.length,
    hintsByLevel: {
      1: hints.filter(({ hintLevel }) => hintLevel === 1).length,
      2: hints.filter(({ hintLevel }) => hintLevel === 2).length,
      3: hints.filter(({ hintLevel }) => hintLevel === 3).length,
    },
    abandonmentByEngine: abandoned.reduce<Record<string, number>>(
      (result, event) => ({
        ...result,
        [event.engine!]: (result[event.engine!] ?? 0) + 1,
      }),
      {},
    ),
    audioRepeats: events.filter(({ event }) => event === 'audio_repeated')
      .length,
    activeDays: new Set(events.map(({ occurredAt }) => occurredAt.slice(0, 10)))
      .size,
    runtimeErrorsPerSession:
      sessions.size === 0
        ? 0
        : events.filter(({ event }) => event === 'runtime_error').length /
          sessions.size,
    areas,
  };
}
