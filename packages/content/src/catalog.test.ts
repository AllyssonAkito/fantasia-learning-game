import { describe, expect, it } from 'vitest';

import { InMemoryContentCatalog } from './catalog';
import type { Activity, Course, Level, Skill, Trail } from './schemas';

const common = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  status: 'published',
  title: 'Título interno',
} as const;

const course: Course = { ...common, id: 'course.logic', order: 0 };
const trail: Trail = {
  ...common,
  id: 'trail.logic.patterns',
  courseId: course.id,
  order: 0,
};
const skill: Skill = {
  ...common,
  id: 'skill.logic.repeat-pattern',
  trailId: trail.id,
  order: 0,
};
const level: Level = {
  ...common,
  id: 'level.logic.patterns.01',
  skillId: skill.id,
  difficulty: 2,
  order: 0,
};
const activity: Activity = {
  ...common,
  id: 'activity.logic.repeat.001',
  levelId: level.id,
  engine: 'sequence',
  difficulty: 2,
  instruction: { text: 'O que vem depois?', ttsFallback: true },
  content: { options: ['circle', 'square'] },
  hints: [],
  reward: { stars: 1, coins: 2 },
  assets: [],
  order: 0,
};

describe('InMemoryContentCatalog', () => {
  it('consulta a hierarquia por curso, trilha, skill e nível', () => {
    const catalog = new InMemoryContentCatalog({
      courses: [course],
      trails: [trail],
      skills: [skill],
      levels: [level],
      activities: [activity],
    });

    expect(catalog.getCourse(course.id)).toEqual(course);
    expect(catalog.getTrailsByCourse(course.id)).toEqual([trail]);
    expect(catalog.getSkillsByTrail(trail.id)).toEqual([skill]);
    expect(catalog.getLevelsBySkill(skill.id)).toEqual([level]);
    expect(catalog.getActivitiesByLevel(level.id)).toEqual([activity]);
  });

  it('retorna estados vazios seguros para referências sem conteúdo', () => {
    const catalog = new InMemoryContentCatalog();

    expect(catalog.getCourse(course.id)).toBeNull();
    expect(catalog.getTrailsByCourse(course.id)).toEqual([]);
    expect(catalog.getSkillsByTrail(trail.id)).toEqual([]);
    expect(catalog.getLevelsBySkill(skill.id)).toEqual([]);
    expect(catalog.getActivitiesByLevel(level.id)).toEqual([]);
  });

  it('ordena resultados e protege o catálogo contra mutação externa', () => {
    const later = { ...trail, id: 'trail.logic.later', order: 2 };
    const earlier = { ...trail, id: 'trail.logic.earlier', order: 1 };
    const catalog = new InMemoryContentCatalog({ trails: [later, earlier] });

    const result = catalog.getTrailsByCourse(course.id);
    result[0]!.title = 'Alterado fora';

    expect(result.map(({ id }) => id)).toEqual([earlier.id, later.id]);
    expect(catalog.getTrailsByCourse(course.id)[0]!.title).toBe(common.title);
  });

  it('recusa registros estruturalmente inválidos antes da consulta', () => {
    expect(
      () =>
        new InMemoryContentCatalog({
          courses: [{ ...course, id: 'logic' }],
        }),
    ).toThrow();
  });
});
