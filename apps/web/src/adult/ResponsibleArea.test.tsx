import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TelemetryEvent } from '@fantasia/telemetry';
import { ResponsibleArea } from './ResponsibleArea';

const profiles = [
  { id: 'profile_abcdef', displayName: 'Melina', avatar: '🐰' },
  { id: 'profile_ghijkl', displayName: 'Convidado', avatar: '🐶' },
];
const common = {
  eventVersion: 1 as const,
  occurredAt: '2026-08-24T12:00:00.000Z',
  sessionId: 'session_123456',
  childProfileId: 'profile_abcdef',
  activityId: 'activity.logic.patterns.001',
  activityVersion: 1,
  engine: 'sequence' as const,
  difficulty: 2,
};
const events: TelemetryEvent[] = [
  { ...common, event: 'activity_started' },
  {
    ...common,
    event: 'answer_submitted',
    attempt: 1,
    result: 'correct',
    elapsedMs: 50_000,
  },
  { ...common, event: 'activity_completed', elapsedMs: 60_000 },
];

describe('ResponsibleArea', () => {
  it('resume uso e explica métricas sem linguagem diagnóstica', () => {
    render(
      <ResponsibleArea events={events} onClose={vi.fn()} profiles={profiles} />,
    );
    expect(
      screen.getByText(/não são avaliação, nota ou diagnóstico/i),
    ).toBeVisible();
    fireEvent.click(screen.getByText('Como calculamos estes números?'));
    expect(screen.getByText(/sem comparar crianças/i)).toBeVisible();
  });

  it('alterna perfis sem misturar dados', () => {
    render(
      <ResponsibleArea events={events} onClose={vi.fn()} profiles={profiles} />,
    );
    fireEvent.change(screen.getByLabelText('Perfil'), {
      target: { value: 'profile_ghijkl' },
    });
    expect(screen.getByRole('heading', { name: /Convidado/ })).toBeVisible();
    expect(
      screen.getByText(/depois das primeiras brincadeiras/i),
    ).toBeVisible();
  });

  it('fecha pelo controle acessível', () => {
    const onClose = vi.fn();
    render(
      <ResponsibleArea
        events={[]}
        onClose={onClose}
        profiles={profiles.slice(0, 1)}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Fechar área do responsável' }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
