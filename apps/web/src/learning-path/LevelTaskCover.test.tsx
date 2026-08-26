import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mvpCatalogSeed } from '@fantasia/content';
import { LevelTaskCover } from './LevelTaskCover';

describe('LevelTaskCover', () => {
  it.each([
    ['level.attention.visual-search.01', 'attention-search'],
    ['level.attention.details.01', 'attention-memory'],
    ['level.attention.focus.01', 'attention-classification'],
  ])('usa capa ilustrada em %s', (levelId, previewKind) => {
    const activity = mvpCatalogSeed.activities!.find(
      (candidate) => candidate.levelId === levelId,
    )!;
    const { container } = render(<LevelTaskCover activity={activity} />);

    expect(
      container.querySelector(`[data-preview-kind="${previewKind}"]`),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-preview-kind="fallback"]'),
    ).not.toBeInTheDocument();
  });

  it('resume O que não encaixa com as quatro figuras da tarefa', () => {
    const activity = mvpCatalogSeed.activities!.find(
      ({ levelId }) => levelId === 'level.logic.odd-one-out.01',
    )!;
    const { container } = render(<LevelTaskCover activity={activity} />);
    const preview = container.querySelector(
      '[data-preview-kind="odd-one-out"]',
    )!;

    expect(preview).toBeInTheDocument();
    expect(preview.querySelectorAll('img')).toHaveLength(4);
    expect(
      container.querySelector('[data-preview-kind="fallback"]'),
    ).not.toBeInTheDocument();
  });
});
