import { describe, expect, it } from 'vitest';

import { InMemoryContentCatalog } from './catalog';
import { buildLearningPathView } from './learning-path';
import { mvpCatalogSeed } from './mvp-catalog';
import type { ContentCatalogSeed } from './catalog';

const seed: ContentCatalogSeed = {
  courses: [
    {
      schemaVersion: 1,
      contentVersion: '1.0.0',
      status: 'published',
      id: 'course.logic',
      title: 'Taxonomia interna de lógica',
      order: 0,
      presentation: { label: 'Lógica', icon: 'icon.blocks' },
    },
  ],
  trails: [
    {
      schemaVersion: 1,
      contentVersion: '1.0.0',
      status: 'published',
      id: 'trail.logic.patterns',
      courseId: 'course.logic',
      title: 'Padrões internos',
      order: 0,
      presentation: { label: 'Caminho das formas', icon: 'icon.path' },
    },
  ],
  skills: [
    {
      schemaVersion: 1,
      contentVersion: '1.0.0',
      status: 'published',
      id: 'skill.logic.repeat-pattern',
      trailId: 'trail.logic.patterns',
      title: 'Reconhecer repetição',
      order: 0,
    },
  ],
  levels: [
    {
      schemaVersion: 1,
      contentVersion: '1.0.0',
      status: 'published',
      id: 'level.logic.patterns.01',
      skillId: 'skill.logic.repeat-pattern',
      title: 'Nível interno 1',
      order: 0,
      difficulty: 1,
      presentation: { label: 'Primeira estrela', icon: 'icon.star' },
    },
    {
      schemaVersion: 1,
      contentVersion: '1.0.0',
      status: 'published',
      id: 'level.logic.patterns.02',
      skillId: 'skill.logic.repeat-pattern',
      title: 'Nível interno 2',
      order: 1,
      difficulty: 2,
      presentation: { label: 'Segunda estrela', icon: 'icon.star' },
    },
  ],
};

describe('buildLearningPathView', () => {
  it('expõe caminho, estado e bloqueio sem títulos taxonômicos internos', () => {
    const view = buildLearningPathView(
      new InMemoryContentCatalog(seed),
      'course.logic',
    );

    expect(view).toMatchObject({
      status: 'ready',
      courseLabel: 'Lógica',
      stops: [
        { label: 'Primeira estrela', state: 'current' },
        { label: 'Segunda estrela', state: 'locked' },
      ],
    });
    expect(JSON.stringify(view)).not.toContain('Taxonomia interna');
    expect(JSON.stringify(view)).not.toContain('Reconhecer repetição');
  });

  it('retorna estado vazio quando não existe apresentação infantil', () => {
    expect(
      buildLearningPathView(new InMemoryContentCatalog(), 'course.logic'),
    ).toEqual({ status: 'empty', stops: [] });
  });

  it('deriva as capas de Lógica da primeira atividade de cada nível', () => {
    const view = buildLearningPathView(
      new InMemoryContentCatalog(mvpCatalogSeed),
      'course.logic',
    );

    expect(view.status).toBe('ready');
    if (view.status !== 'ready') return;
    expect(view.stops.slice(0, 3).map(({ cover }) => cover?.kind)).toEqual([
      'sequence',
      'assembly',
      'clue',
    ]);
    expect(view.stops[0]!.cover).toEqual({
      kind: 'sequence',
      assetIds: [
        'asset.symbol.star',
        'asset.symbol.heart',
        'asset.symbol.star',
      ],
    });
    expect(view.stops[1]!.cover).toMatchObject({
      kind: 'assembly',
      pieceIds: [
        expect.stringContaining('.top'),
        expect.stringContaining('.middle'),
        expect.stringContaining('.bottom'),
      ],
    });
    expect(view.stops[2]!.cover).toMatchObject({
      kind: 'clue',
      assetId: 'asset.symbol.rabbit',
    });
  });
});
