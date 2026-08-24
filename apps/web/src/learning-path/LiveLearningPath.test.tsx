import { exampleCatalogSeed, InMemoryContentCatalog } from '@fantasia/content';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiveLearningPath } from './LiveLearningPath';
import { LearningPathProgressStore } from './LearningPathProgressStore';

describe('LiveLearningPath', () => {
  it('atualiza conclusão e desbloqueio sem recarregar a aplicação', () => {
    const firstLevel = exampleCatalogSeed.levels?.find(
      (level) => level.id === 'level.logic.first-steps.01',
    );
    if (!firstLevel) throw new Error('Fixture de lógica ausente.');
    const catalog = new InMemoryContentCatalog({
      ...exampleCatalogSeed,
      levels: [
        ...(exampleCatalogSeed.levels ?? []),
        {
          ...firstLevel,
          id: 'level.logic.first-steps.02',
          order: 1,
          presentation: { ...firstLevel.presentation!, label: 'Próxima fase' },
        },
      ],
    });
    const store = new LearningPathProgressStore();
    render(
      <LiveLearningPath
        catalog={catalog}
        courseId="course.logic"
        store={store}
      />,
    );
    const first = screen.getAllByRole('button')[0]!;
    const second = screen.getAllByRole('button')[1]!;
    expect(first).toBeEnabled();
    expect(second).toBeDisabled();

    act(() => {
      store.completeLevel(
        first.getAttribute('data-level-id')!,
        second.getAttribute('data-level-id')!,
      );
    });

    expect(first).toHaveAccessibleName(/Concluído/);
    expect(second).toBeEnabled();
  });
});
