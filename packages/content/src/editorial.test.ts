import { describe, expect, it } from 'vitest';

import {
  canEditEditorialContent,
  canTransitionEditorialStatus,
} from './editorial';

describe('fluxo editorial', () => {
  it('permite revisão, retorno para draft, publicação e retirada', () => {
    expect(canTransitionEditorialStatus('draft', 'review')).toBe(true);
    expect(canTransitionEditorialStatus('review', 'draft')).toBe(true);
    expect(canTransitionEditorialStatus('review', 'published')).toBe(true);
    expect(canTransitionEditorialStatus('published', 'retired')).toBe(true);
  });

  it('impede atalhos e mutação de conteúdo publicado ou retirado', () => {
    expect(canTransitionEditorialStatus('draft', 'published')).toBe(false);
    expect(canTransitionEditorialStatus('retired', 'published')).toBe(false);
    expect(canEditEditorialContent('published')).toBe(false);
    expect(canEditEditorialContent('retired')).toBe(false);
  });
});
