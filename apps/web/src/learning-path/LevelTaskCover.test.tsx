import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mvpCatalogSeed } from '@fantasia/content';
import { LevelTaskCover } from './LevelTaskCover';

describe('LevelTaskCover', () => {
  it('mantém um fallback seguro para áreas ainda não especializadas', () => {
    const activity = mvpCatalogSeed.activities!.find(
      ({ levelId }) => levelId === 'level.attention.visual-search.01',
    )!;
    const { container } = render(<LevelTaskCover activity={activity} />);

    expect(
      container.querySelector('[data-preview-kind="fallback"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-preview-kind="pattern"]'),
    ).not.toBeInTheDocument();
  });
});
