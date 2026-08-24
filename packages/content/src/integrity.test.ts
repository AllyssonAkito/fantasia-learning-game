import { describe, expect, it } from 'vitest';

import type { Course, Trail } from './schemas';
import { validateCatalogIntegrity } from './integrity';

const common = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  status: 'draft',
  title: 'Interno',
  order: 0,
} as const;
const course: Course = { ...common, id: 'course.logic' };
const trail: Trail = {
  ...common,
  id: 'trail.logic.patterns',
  courseId: course.id,
};

describe('validateCatalogIntegrity', () => {
  it('aceita referências existentes e IDs únicos', () => {
    expect(() =>
      validateCatalogIntegrity({ courses: [course], trails: [trail] }),
    ).not.toThrow();
  });

  it('impede build com ID duplicado', () => {
    expect(() =>
      validateCatalogIntegrity({ courses: [course, { ...course }] }),
    ).toThrow(`ID duplicado: ${course.id}`);
  });

  it('impede build com referência ausente', () => {
    expect(() => validateCatalogIntegrity({ trails: [trail] })).toThrow(
      `Referência ausente: ${trail.id} → ${course.id}`,
    );
  });
});
