import { parseTelemetryEvent, type TelemetryEvent } from './events';

export interface TelemetryAdapter {
  append(event: TelemetryEvent): void;
  list(): TelemetryEvent[];
  deleteByProfile(childProfileId: string): number;
  pruneBefore(isoDate: string): number;
  clear(): void;
}

export class InMemoryTelemetryAdapter implements TelemetryAdapter {
  protected events: TelemetryEvent[] = [];

  append(event: TelemetryEvent) {
    this.events.push(parseTelemetryEvent(event));
  }

  list() {
    return this.events.map((event) => ({ ...event }));
  }

  deleteByProfile(childProfileId: string) {
    const before = this.events.length;
    this.events = this.events.filter(
      (event) => event.childProfileId !== childProfileId,
    );
    return before - this.events.length;
  }

  pruneBefore(isoDate: string) {
    const before = this.events.length;
    this.events = this.events.filter((event) => event.occurredAt >= isoDate);
    return before - this.events.length;
  }

  clear() {
    this.events = [];
  }
}

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class LocalTelemetryAdapter extends InMemoryTelemetryAdapter {
  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key = 'fantasia.telemetry.v1',
  ) {
    super();
    const saved = storage.getItem(key);
    if (!saved) return;
    try {
      const candidates = JSON.parse(saved) as unknown[];
      this.events = candidates.map(parseTelemetryEvent);
    } catch {
      storage.removeItem(key);
    }
  }

  override append(event: TelemetryEvent) {
    super.append(event);
    this.persist();
  }
  override deleteByProfile(profileId: string) {
    const removed = super.deleteByProfile(profileId);
    this.persist();
    return removed;
  }
  override pruneBefore(isoDate: string) {
    const removed = super.pruneBefore(isoDate);
    this.persist();
    return removed;
  }
  override clear() {
    super.clear();
    this.storage.removeItem(this.key);
  }

  private persist() {
    this.storage.setItem(this.key, JSON.stringify(this.events));
  }
}
