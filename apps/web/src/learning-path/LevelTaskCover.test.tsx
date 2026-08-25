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
});
