import { describe, expect, it } from 'vitest';
import { InMemoryContentCatalog } from './catalog';
import { mvpAssets } from './mvp-assets';
import { mvpCatalogSeed, mvpContentCoverage } from './mvp-catalog';
import { validatePublishableCatalog } from './publish-validation';

describe('catálogo MVP', () => {
  it('publica 21 atividades válidas em cada uma das seis áreas', () => {
    expect(validatePublishableCatalog(mvpCatalogSeed, mvpAssets)).toEqual({
      activities: 126,
      areas: 6,
      assets: 26,
    });
    const counts = mvpContentCoverage.reduce<Record<string, number>>(
      (result, { area }) => ({ ...result, [area]: (result[area] ?? 0) + 1 }),
      {},
    );
    expect(Object.values(counts)).toEqual([21, 21, 21, 21, 21, 21]);
  });

  it('usa somente recortes do mesmo mascote nas atividades de montagem', () => {
    const assemblyActivities = mvpCatalogSeed.activities!.filter(
      ({ engine }) => engine === 'assembly',
    );
    expect(assemblyActivities).toHaveLength(13);
    for (const activity of assemblyActivities) {
      const pieceIds = activity.assets;
      expect(pieceIds).toHaveLength(3);
      expect(pieceIds.every((id) => id.startsWith('asset.character.'))).toBe(
        true,
      );
      expect(new Set(pieceIds.map((id) => id.split('.')[2]))).toHaveLength(1);
    }
  });

  it('mapeia área, habilidade, dificuldade e todos os motores', () => {
    expect(new Set(mvpContentCoverage.map(({ engine }) => engine)).size).toBe(
      8,
    );
    expect(mvpCatalogSeed.skills).toHaveLength(21);
    expect(
      new Set(mvpContentCoverage.map(({ difficulty }) => difficulty)),
    ).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it('carrega a hierarquia completa no repositório de conteúdo', () => {
    const catalog = new InMemoryContentCatalog(mvpCatalogSeed);
    expect(catalog.getTrailsByCourse('course.logic')).toHaveLength(1);
    expect(
      catalog.getActivitiesByLevel('level.logic.patterns.01'),
    ).toHaveLength(6);
    expect(catalog.getSkillsByTrail('trail.logic.adventure')).toHaveLength(6);
    for (const levelId of [
      'level.logic.journey-a.01',
      'level.logic.journey-b.01',
      'level.logic.journey-c.01',
    ]) {
      expect(catalog.getActivitiesByLevel(levelId)).toHaveLength(6);
    }
  });

  it('diferencia Descobrir de Padrões com pistas de imagem parcial', () => {
    const deductionActivities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.logic.deduction.01',
    );

    expect(deductionActivities).toHaveLength(6);
    for (const activity of deductionActivities) {
      expect(activity.engine).toBe('choice');
      expect(activity.content).toMatchObject({
        clue: {
          assetId: expect.any(String),
          focusX: expect.stringMatching(/left|center|right/),
          focusY: expect.stringMatching(/top|center|bottom/),
        },
        correctOptionId: expect.any(String),
        options: expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
        ]),
      });
    }
    expect(
      new Set(deductionActivities.map(({ content }) => JSON.stringify(content)))
        .size,
    ).toBe(6);
  });

  it('usa uma curadoria leve nas seis sequências de Padrões', () => {
    const patternActivities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.logic.patterns.01',
    );
    const patterns = patternActivities.map(
      ({ content }) =>
        (content as { pattern: string[]; expectedId: string }).pattern,
    );

    expect(patterns).toEqual([
      ['asset.symbol.star', 'asset.symbol.heart', 'asset.symbol.star'],
      ['asset.symbol.heart', 'asset.symbol.circle', 'asset.symbol.heart'],
      ['asset.symbol.circle', 'asset.symbol.flower', 'asset.symbol.circle'],
      ['asset.symbol.flower', 'asset.symbol.rabbit', 'asset.symbol.flower'],
      ['asset.symbol.rabbit', 'asset.symbol.dog', 'asset.symbol.rabbit'],
      ['asset.symbol.dog', 'asset.symbol.fish', 'asset.symbol.dog'],
    ]);
    expect(patternActivities.flatMap(({ assets }) => assets)).not.toEqual(
      expect.arrayContaining(['asset.symbol.square', 'asset.symbol.triangle']),
    );
  });

  it('distribui a expansão em três níveis variados e progressivos', () => {
    const expansion = ['journey-a', 'journey-b', 'journey-c'].map((journey) =>
      mvpCatalogSeed.activities!.filter(({ levelId }) =>
        levelId.includes(journey),
      ),
    );
    expect(expansion.map((items) => items.length)).toEqual([6, 6, 6]);
    expect(
      expansion.map((items) => new Set(items.map(({ engine }) => engine)).size),
    ).toEqual([6, 4, 6]);
    expect(
      expansion.map(
        (items) => new Set(items.map(({ id }) => id.split('.')[1])).size,
      ),
    ).toEqual([6, 6, 6]);
    expect(
      expansion.map((items) => Math.max(...items.map((a) => a.difficulty))),
    ).toEqual([2, 4, 6]);
    expect(
      expansion.flat().filter(({ title }) => title.includes('Melina')),
    ).toHaveLength(2);
  });

  it('bloqueia conteúdo incompatível com o motor', () => {
    const broken = {
      ...mvpCatalogSeed,
      activities: mvpCatalogSeed.activities!.map((activity, index) =>
        index === 0 ? { ...activity, content: { invalid: true } } : activity,
      ),
    };
    expect(() => validatePublishableCatalog(broken, mvpAssets)).toThrow(
      'incompatível com',
    );
  });
});
