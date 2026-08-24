import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryContentCatalog, mvpCatalogSeed } from '@fantasia/content';
import { LearningPathProgressStore } from '../learning-path/LearningPathProgressStore';
import { FantasiaApp } from './FantasiaApp';
import type { AudioService } from '@fantasia/audio';

const audio = {
  repeatInstruction: vi.fn(async () => 'visual-only' as const),
  playEffect: vi.fn(async () => true),
} as unknown as AudioService;

afterEach(() => vi.useRealTimers());

describe('FantasiaApp', () => {
  it('abre o resumo somente após o gesto adulto protegido', () => {
    vi.useFakeTimers();
    render(
      <FantasiaApp
        audio={audio}
        catalog={new InMemoryContentCatalog(mvpCatalogSeed)}
        progressStore={new LearningPathProgressStore()}
        profiles={[
          { id: 'profile_abcdef', displayName: 'Melina', avatar: '🐰' },
        ]}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Abrir acesso do responsável' }),
    );
    const hold = screen.getByRole('button', { name: 'Segure por 2 segundos' });
    fireEvent.pointerDown(hold);
    act(() => vi.advanceTimersByTime(2000));
    expect(
      screen.getByRole('heading', { name: 'Resumo das brincadeiras' }),
    ).toBeVisible();
  });

  it('percorre as seis tarefas antes de concluir e avançar o nível', () => {
    render(
      <FantasiaApp
        audio={audio}
        catalog={new InMemoryContentCatalog(mvpCatalogSeed)}
        profiles={[]}
        progressStore={new LearningPathProgressStore()}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /Padrões.*Pronto para brincar/i,
      }),
    );
    expect(
      screen.getAllByRole('button', { name: /Atividade \d/i }),
    ).toHaveLength(6);

    const activities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.logic.patterns.01',
    );
    for (const [index, activity] of activities.entries()) {
      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(`Atividade ${index + 1}.*Pronta`, 'i'),
        }),
      );
      expect(
        screen.getByRole('heading', { name: 'O que vem depois?' }),
      ).toBeVisible();
      const expectedId = (activity.content as { expectedId: string })
        .expectedId;
      const label = (
        activity.content as { options: { id: string; label: string }[] }
      ).options.find(({ id }) => id === expectedId)!.label;
      fireEvent.click(screen.getByRole('button', { name: label }));
      fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    }

    expect(
      screen.getByRole('button', { name: /Padrões.*Concluído/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Montar.*Pronto para brincar/i }),
    ).toBeEnabled();
  });
});
