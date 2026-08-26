import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LearningPathCover } from './LearningPathCover';

describe('LearningPathCover', () => {
  it('mantém uma capa neutra quando o nível ainda não tem prévia', () => {
    const { container } = render(<LearningPathCover />);
    expect(
      container.querySelector('.path-cover--fallback'),
    ).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('transforma a primeira brincadeira em uma capa de floresta', () => {
    const { container } = render(
      <LearningPathCover
        cover={{
          kind: 'odd-one-out',
          assetIds: [
            'asset.game.odd-tree.tall',
            'asset.game.odd-tree.round',
            'asset.game.odd-tree.puppy',
            'asset.game.odd-tree.narrow',
          ],
        }}
      />,
    );

    expect(
      container.querySelector('[data-cover="odd-one-out"]'),
    ).toHaveAttribute('data-scene', 'trees');
    expect(container.querySelectorAll('.activity-sprite-image')).toHaveLength(
      4,
    );
  });
});
