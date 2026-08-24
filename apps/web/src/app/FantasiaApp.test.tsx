import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryContentCatalog, mvpCatalogSeed } from '@fantasia/content';
import { LearningPathProgressStore } from '../learning-path/LearningPathProgressStore';
import { FantasiaApp } from './FantasiaApp';

afterEach(() => vi.useRealTimers());

describe('FantasiaApp', () => {
  it('abre o resumo somente após o gesto adulto protegido', () => {
    vi.useFakeTimers();
    render(
      <FantasiaApp
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
});
