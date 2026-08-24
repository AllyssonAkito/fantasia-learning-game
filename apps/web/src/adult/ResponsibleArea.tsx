import { useMemo, useState } from 'react';
import type { MvpMetrics, TelemetryEvent } from '@fantasia/telemetry';
import { aggregateMvpMetrics } from '@fantasia/telemetry';

export interface ResponsibleProfile {
  id: string;
  displayName: string;
  avatar: string;
}

export interface ResponsibleAreaProps {
  profiles: readonly ResponsibleProfile[];
  events: readonly TelemetryEvent[];
  onClose: () => void;
}

const areaLabels: Record<string, string> = {
  logic: 'Lógica',
  attention: 'Atenção',
  association: 'Associação',
  numbers: 'Números',
  shapes: 'Formas e percepção',
  memory: 'Memória',
};

function minutes(milliseconds: number) {
  return Math.round(milliseconds / 60_000);
}

function AreaSummary({ metrics }: { metrics: MvpMetrics }) {
  if (metrics.areas.length === 0) {
    return (
      <p className="responsible-area__empty">
        O resumo por área aparecerá depois das primeiras brincadeiras.
      </p>
    );
  }
  const ordered = [...metrics.areas].sort(
    (left, right) =>
      left.averageAttempts + left.hints - (right.averageAttempts + right.hints),
  );
  const comfortable = ordered[0]!;
  const supported = ordered.at(-1)!;
  return (
    <div className="responsible-area__areas">
      <p>
        <strong>Brincadeira mais fluida:</strong>{' '}
        {areaLabels[comfortable.area] ?? comfortable.area}
      </p>
      <p>
        <strong>Área que recebeu mais apoio:</strong>{' '}
        {areaLabels[supported.area] ?? supported.area}
      </p>
      <p className="responsible-area__note">
        Estes sinais descrevem as sessões recentes. Eles não são avaliação, nota
        ou diagnóstico.
      </p>
    </div>
  );
}

export function ResponsibleArea({
  profiles,
  events,
  onClose,
}: ResponsibleAreaProps) {
  const [profileId, setProfileId] = useState(profiles[0]?.id ?? '');
  const profile = profiles.find(({ id }) => id === profileId);
  const metrics = useMemo(
    () =>
      aggregateMvpMetrics(
        events.filter((event) => event.childProfileId === profileId),
      ),
    [events, profileId],
  );
  return (
    <div
      className="responsible-area"
      role="dialog"
      aria-modal="true"
      aria-labelledby="responsible-area-title"
    >
      <section className="responsible-area__panel">
        <header className="responsible-area__header">
          <div>
            <p className="responsible-area__eyebrow">Área do responsável</p>
            <h1 id="responsible-area-title">Resumo das brincadeiras</h1>
          </div>
          <button
            aria-label="Fechar área do responsável"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>
        {profiles.length > 1 ? (
          <label className="responsible-area__selector">
            Perfil
            <select
              value={profileId}
              onChange={(event) => setProfileId(event.target.value)}
            >
              {profiles.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.displayName}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {profile ? (
          <>
            <h2>
              <span aria-hidden="true">{profile.avatar}</span>{' '}
              {profile.displayName}
            </h2>
            <div
              className="responsible-area__metrics"
              aria-label="Resumo de uso"
            >
              <article>
                <strong>{minutes(metrics.totalActivityMs)}</strong>
                <span>minutos em atividades</span>
              </article>
              <article>
                <strong>{metrics.activeDays}</strong>
                <span>dias com brincadeira</span>
              </article>
              <article>
                <strong>{metrics.activitiesCompleted}</strong>
                <span>atividades concluídas</span>
              </article>
            </div>
            <section aria-labelledby="area-summary-title">
              <h2 id="area-summary-title">Como foram as áreas</h2>
              <AreaSummary metrics={metrics} />
            </section>
            <details>
              <summary>Como calculamos estes números?</summary>
              <p>
                Tempo soma apenas atividades concluídas. Dias contam datas com
                uso. Áreas consideram tentativas e dicas, sem comparar crianças.
              </p>
            </details>
          </>
        ) : (
          <p className="responsible-area__empty">
            Nenhum perfil infantil ativo.
          </p>
        )}
      </section>
    </div>
  );
}
