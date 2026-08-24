import type { TelemetryAdapter } from './adapters';

export const TELEMETRY_RETENTION_DAYS = 30;

export function applyRetention(adapter: TelemetryAdapter, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - TELEMETRY_RETENTION_DAYS);
  return adapter.pruneBefore(cutoff.toISOString());
}

export function deleteProfileTelemetry(
  adapter: TelemetryAdapter,
  childProfileId: string,
) {
  return adapter.deleteByProfile(childProfileId);
}
