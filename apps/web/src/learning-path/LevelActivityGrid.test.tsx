import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mvpCatalogSeed } from '@fantasia/content';
import { LevelActivityGrid } from './LevelActivityGrid';
import { LearningPathProgressStore } from './LearningPathProgressStore';

const activities = mvpCatalogSeed.activities!.filter(
  ({ levelId }) => levelId === 'level.logic.patterns.01',
);

describe('LevelActivityGrid', () => {
  it('mostra seis tarefas e libera uma por vez', () => {
    const store = new LearningPathProgressStore();
    const onSelect = vi.fn();
    render(
      <LevelActivityGrid
        activities={activities}
        onBack={vi.fn()}
        onSelect={onSelect}
        store={store}
      />,
    );

    expect(
      screen.getAllByRole('button', { name: /Atividade \d/i }),
    ).toHaveLength(6);
    expect(
      screen.getByRole('button', { name: /Atividade 1.*Pronta/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: /Atividade 2.*Bloqueada/i }),
    ).toBeDisabled();

    const previews = document.querySelectorAll('[data-preview-kind="pattern"]');
    expect(previews).toHaveLength(6);
    const firstPreview = previews[0]!;
    expect(
      Array.from(firstPreview.querySelectorAll('img')).map((image) =>
        image.getAttribute('src'),
      ),
    ).toEqual([
      '/assets/activity/star.webp',
      '/assets/activity/heart.webp',
      '/assets/activity/star.webp',
    ]);
    expect(
      firstPreview.querySelector('.level-task__pattern-gap'),
    ).toBeInTheDocument();
    expect(
      Array.from(document.querySelectorAll('[data-preview-kind="pattern"] img'))
        .map((image) => image.getAttribute('src'))
        .join(' '),
    ).not.toMatch(/square|triangle/);
    expect(screen.queryByText('🧩')).not.toBeInTheDocument();

    act(() => {
      store.completeActivity(
        activities[0]!.id,
        activities[0]!.levelId,
        activities.map(({ id }) => id),
      );
    });

    expect(
      screen.getByRole('button', { name: /Atividade 1.*Concluída/i }),
    ).toBeEnabled();
    const second = screen.getByRole('button', { name: /Atividade 2.*Pronta/i });
    expect(second).toBeEnabled();
    fireEvent.click(second);
    expect(onSelect).toHaveBeenCalledWith(activities[1]!.id);
  });
});
