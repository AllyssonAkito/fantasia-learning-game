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

  it('percorre as doze tarefas antes de concluir e avançar o nível', () => {
    vi.useFakeTimers();
    render(
      <FantasiaApp
        audio={audio}
        catalog={new InMemoryContentCatalog(mvpCatalogSeed)}
        profiles={[]}
        progressStore={new LearningPathProgressStore()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Lógica' }));
    fireEvent.click(
      screen.getByRole('button', {
        name: /O que não encaixa.*Pronto para brincar/i,
      }),
    );
    expect(
      screen.getAllByRole('button', { name: /Atividade \d/i }),
    ).toHaveLength(12);

    const activities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.logic.odd-one-out.01',
    );
    for (const [index, activity] of activities.entries()) {
      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(`Atividade ${index + 1}.*Pronta`, 'i'),
        }),
      );
      act(() => vi.advanceTimersByTime(1040));
      const definition = activity.content as {
        options: { id: string; label: string }[];
        correctOptionId: string;
      };
      const label = definition.options.find(
        ({ id }) => id === definition.correctOptionId,
      )!.label;
      fireEvent.click(screen.getByRole('button', { name: label }));
      act(() => vi.advanceTimersByTime(2090));
      fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    }

    expect(
      screen.getByRole('button', { name: /O que não encaixa.*Concluído/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Padrões.*Pronto para brincar/i }),
    ).toBeEnabled();
  });

  it('abre Atenção, conclui Procurar e libera Detalhes na mesma área', () => {
    render(
      <FantasiaApp
        audio={audio}
        catalog={new InMemoryContentCatalog(mvpCatalogSeed)}
        profiles={[]}
        progressStore={new LearningPathProgressStore()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Atenção' }));
    expect(screen.getByRole('heading', { name: 'Atenção' })).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Procurar 1.*Pronto para brincar/i,
      }),
    );

    const activities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.attention.visual-search.01',
    );
    for (const [index, activity] of activities.entries()) {
      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(`Atividade ${index + 1}.*Pronta`, 'i'),
        }),
      );
      const definition = activity.content as {
        options: { id: string; label: string }[];
        correctOptionId: string;
      };
      const label = definition.options.find(
        ({ id }) => id === definition.correctOptionId,
      )!.label;
      fireEvent.click(screen.getByRole('button', { name: label }));
      fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    }

    expect(
      screen.getByRole('button', { name: /Procurar 1.*Concluído/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Detalhes 1.*Pronto para brincar/i }),
    ).toBeEnabled();
  });

  it('volta da trilha de Atenção para a escolha do Nível 1', () => {
    render(
      <FantasiaApp
        audio={audio}
        catalog={new InMemoryContentCatalog(mvpCatalogSeed)}
        profiles={[]}
        progressStore={new LearningPathProgressStore()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Atenção' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Voltar para o Nível 1' }),
    );
    expect(screen.getByRole('heading', { name: 'Nível 1' })).toBeVisible();
  });
});
