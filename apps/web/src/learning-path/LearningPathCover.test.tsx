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
});
