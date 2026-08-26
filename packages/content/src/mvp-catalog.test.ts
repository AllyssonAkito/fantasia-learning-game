import { describe, expect, it } from 'vitest';
import { InMemoryContentCatalog } from './catalog';
import { mvpAssets } from './mvp-assets';
import { mvpCatalogSeed, mvpContentCoverage } from './mvp-catalog';
import { validatePublishableCatalog } from './publish-validation';

describe('catálogo MVP', () => {
  it('publica o catálogo ampliado com cobertura mínima nas seis áreas', () => {
    expect(validatePublishableCatalog(mvpCatalogSeed, mvpAssets)).toEqual({
      activities: 132,
      areas: 6,
      assets: 50,
    });
    const counts = mvpContentCoverage.reduce<Record<string, number>>(
      (result, { area }) => ({ ...result, [area]: (result[area] ?? 0) + 1 }),
      {},
    );
    expect(Object.values(counts)).toEqual([27, 21, 21, 21, 21, 21]);
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
    expect(mvpCatalogSeed.skills).toHaveLength(22);
    expect(
      new Set(mvpContentCoverage.map(({ difficulty }) => difficulty)),
    ).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it('identifica todas as fases publicadas como Nível 1', () => {
    const levels = mvpCatalogSeed.levels!;
    expect(levels).toHaveLength(22);
    expect(
      levels.every(({ presentation }) => presentation?.label.endsWith(' 1')),
    ).toBe(true);
    expect(
      levels
        .filter(({ skillId }) => skillId.startsWith('skill.logic.'))
        .map(({ presentation }) => presentation!.label),
    ).toEqual([
      'Padrões 1',
      'Montar 1',
      'Descobrir 1',
      'Reconhecer 1',
      'Relacionar 1',
      'Combinar 1',
      'O que não encaixa 1',
    ]);
  });

  it('carrega a hierarquia completa no repositório de conteúdo', () => {
    const catalog = new InMemoryContentCatalog(mvpCatalogSeed);
    expect(catalog.getTrailsByCourse('course.logic')).toHaveLength(1);
    expect(
      catalog.getActivitiesByLevel('level.logic.patterns.01'),
    ).toHaveLength(6);
    expect(catalog.getSkillsByTrail('trail.logic.adventure')).toHaveLength(7);
    expect(
      catalog.getActivitiesByLevel('level.logic.odd-one-out.01'),
    ).toHaveLength(6);
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

  it('publica seis desafios visuais variados em O que não encaixa', () => {
    const activities = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.logic.odd-one-out.01',
    );

    expect(activities).toHaveLength(6);
    expect(
      activities.map(({ content }) => {
        const definition = content as {
          options: { id: string }[];
          correctOptionId: string;
        };
        return definition.options.findIndex(
          ({ id }) => id === definition.correctOptionId,
        );
      }),
    ).toEqual([2, 3, 3, 2, 0, 2]);
    expect(activities.map(({ title }) => title)).toEqual([
      'O cachorrinho escondido',
      'A chave dos cadeados',
      'O planeta ensolarado',
      'A estrela entre os peixes',
      'A borboleta entre os pássaros',
      'O polvinho da Melina',
    ]);
    expect(
      activities.every(({ engine, assets, content, instruction }) => {
        const definition = content as {
          options: { id: string }[];
          correctOptionId: string;
        };
        return (
          engine === 'choice' &&
          assets.length === 4 &&
          new Set(assets).size === 4 &&
          assets.every((id) => id.startsWith('asset.game.odd-')) &&
          definition.options.length === 4 &&
          definition.options.some(
            ({ id }) => id === definition.correctOptionId,
          ) &&
          instruction.ttsFallback === true &&
          /qual não encaixa\?/i.test(instruction.text)
        );
      }),
    ).toBe(true);
    expect(activities[0]!.assets).toEqual([
      'asset.game.odd-tree.tall',
      'asset.game.odd-tree.round',
      'asset.game.odd-tree.puppy',
      'asset.game.odd-tree.narrow',
    ]);
  });

  it('publica as três fases de Atenção com seis desafios específicos', () => {
    const attentionLevels = mvpCatalogSeed.levels!.filter(({ skillId }) =>
      skillId.startsWith('skill.attention.'),
    );
    expect(
      attentionLevels.map(({ presentation }) => presentation!.label),
    ).toEqual(['Procurar 1', 'Detalhes 1', 'Separar 1']);

    const search = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.attention.visual-search.01',
    );
    const details = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.attention.details.01',
    );
    const classification = mvpCatalogSeed.activities!.filter(
      ({ levelId }) => levelId === 'level.attention.focus.01',
    );

    expect([search.length, details.length, classification.length]).toEqual([
      6, 6, 6,
    ]);
    expect(search.every(({ engine }) => engine === 'choice')).toBe(true);
    expect(
      search.every(({ content }) => {
        const definition = content as {
          options: { id: string }[];
          correctOptionId: string;
        };
        return (
          definition.options.length === 3 &&
          definition.options.some(({ id }) => id === definition.correctOptionId)
        );
      }),
    ).toBe(true);
    expect(details.every(({ engine }) => engine === 'memory')).toBe(true);
    expect(
      details.map(
        ({ content }) => (content as { expected: string[] }).expected.length,
      ),
    ).toEqual([2, 2, 3, 3, 4, 4]);
    expect(
      classification.every(({ engine, content }) => {
        const definition = content as {
          groups: { id: string }[];
          assignments: Record<string, string>;
        };
        return (
          engine === 'classification' &&
          definition.groups.length === 2 &&
          Object.keys(definition.assignments).length >= 3
        );
      }),
    ).toBe(true);
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
