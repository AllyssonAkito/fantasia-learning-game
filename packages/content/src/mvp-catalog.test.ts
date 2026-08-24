import { describe, expect, it } from 'vitest';
import { InMemoryContentCatalog } from './catalog';
import { mvpAssets } from './mvp-assets';
import { mvpCatalogSeed, mvpContentCoverage } from './mvp-catalog';
import { validatePublishableCatalog } from './publish-validation';

describe('catálogo MVP', () => {
  it('publica 18 atividades válidas em cada uma das seis áreas', () => {
    expect(validatePublishableCatalog(mvpCatalogSeed, mvpAssets)).toEqual({
      activities: 108,
      areas: 6,
      assets: 12,
    });
    const counts = mvpContentCoverage.reduce<Record<string, number>>(
      (result, { area }) => ({ ...result, [area]: (result[area] ?? 0) + 1 }),
      {},
    );
    expect(Object.values(counts)).toEqual([18, 18, 18, 18, 18, 18]);
  });

  it('mapeia área, habilidade, dificuldade e todos os motores', () => {
    expect(new Set(mvpContentCoverage.map(({ engine }) => engine)).size).toBe(
      8,
    );
    expect(new Set(mvpContentCoverage.map(({ skill }) => skill)).size).toBe(18);
    expect(
      new Set(mvpContentCoverage.map(({ difficulty }) => difficulty)),
    ).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it('carrega a hierarquia completa no repositório de conteúdo', () => {
    const catalog = new InMemoryContentCatalog(mvpCatalogSeed);
    expect(catalog.getTrailsByCourse('course.logic')).toHaveLength(1);
    expect(catalog.getSkillsByTrail('trail.logic.adventure')).toHaveLength(3);
    expect(
      catalog.getActivitiesByLevel('level.logic.patterns.01'),
    ).toHaveLength(6);
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
