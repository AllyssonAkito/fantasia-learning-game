import type { ContentCatalogSeed } from './catalog';

export class CatalogIntegrityError extends Error {
  constructor(readonly issues: readonly string[]) {
    super(`Catálogo inválido: ${issues.join('; ')}`);
    this.name = 'CatalogIntegrityError';
  }
}

export function validateCatalogIntegrity(seed: ContentCatalogSeed): void {
  const issues: string[] = [];
  const all = [
    ...(seed.courses ?? []),
    ...(seed.trails ?? []),
    ...(seed.skills ?? []),
    ...(seed.levels ?? []),
    ...(seed.activities ?? []),
  ];
  const seen = new Set<string>();

  for (const entity of all) {
    if (seen.has(entity.id)) {
      issues.push(`ID duplicado: ${entity.id}`);
    }
    seen.add(entity.id);
  }

  const courses = new Set((seed.courses ?? []).map(({ id }) => id));
  const trails = new Set((seed.trails ?? []).map(({ id }) => id));
  const skills = new Set((seed.skills ?? []).map(({ id }) => id));
  const levels = new Set((seed.levels ?? []).map(({ id }) => id));

  for (const trail of seed.trails ?? []) {
    if (!courses.has(trail.courseId)) {
      issues.push(`Referência ausente: ${trail.id} → ${trail.courseId}`);
    }
  }
  for (const skill of seed.skills ?? []) {
    if (!trails.has(skill.trailId)) {
      issues.push(`Referência ausente: ${skill.id} → ${skill.trailId}`);
    }
  }
  for (const level of seed.levels ?? []) {
    if (!skills.has(level.skillId)) {
      issues.push(`Referência ausente: ${level.id} → ${level.skillId}`);
    }
  }
  for (const activity of seed.activities ?? []) {
    if (!levels.has(activity.levelId)) {
      issues.push(`Referência ausente: ${activity.id} → ${activity.levelId}`);
    }
  }

  if (issues.length > 0) {
    throw new CatalogIntegrityError(issues);
  }
}
