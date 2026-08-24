import {
  activitySchema,
  courseSchema,
  levelSchema,
  skillSchema,
  trailSchema,
  type Activity,
  type Course,
  type Level,
  type Skill,
  type Trail,
} from './schemas';

export interface ContentCatalogSeed {
  courses?: readonly Course[];
  trails?: readonly Trail[];
  skills?: readonly Skill[];
  levels?: readonly Level[];
  activities?: readonly Activity[];
}

export interface ContentCatalog {
  getCourse(id: string): Course | null;
  getTrailsByCourse(courseId: string): Trail[];
  getSkillsByTrail(trailId: string): Skill[];
  getLevelsBySkill(skillId: string): Level[];
  getActivitiesByLevel(levelId: string): Activity[];
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function ordered<T extends { id: string; order: number }>(values: T[]): T[] {
  return values.sort((left, right) =>
    left.order === right.order
      ? left.id.localeCompare(right.id)
      : left.order - right.order,
  );
}

export class InMemoryContentCatalog implements ContentCatalog {
  readonly #courses = new Map<string, Course>();
  readonly #trails = new Map<string, Trail>();
  readonly #skills = new Map<string, Skill>();
  readonly #levels = new Map<string, Level>();
  readonly #activities = new Map<string, Activity>();

  constructor(seed: ContentCatalogSeed = {}) {
    for (const candidate of seed.courses ?? []) {
      const course = courseSchema.parse(candidate);
      this.#courses.set(course.id, copy(course));
    }
    for (const candidate of seed.trails ?? []) {
      const trail = trailSchema.parse(candidate);
      this.#trails.set(trail.id, copy(trail));
    }
    for (const candidate of seed.skills ?? []) {
      const skill = skillSchema.parse(candidate);
      this.#skills.set(skill.id, copy(skill));
    }
    for (const candidate of seed.levels ?? []) {
      const level = levelSchema.parse(candidate);
      this.#levels.set(level.id, copy(level));
    }
    for (const candidate of seed.activities ?? []) {
      const activity = activitySchema.parse(candidate);
      this.#activities.set(activity.id, copy(activity));
    }
  }

  getCourse(id: string): Course | null {
    const course = this.#courses.get(id);
    return course ? copy(course) : null;
  }

  getTrailsByCourse(courseId: string): Trail[] {
    return ordered(
      [...this.#trails.values()]
        .filter((trail) => trail.courseId === courseId)
        .map(copy),
    );
  }

  getSkillsByTrail(trailId: string): Skill[] {
    return ordered(
      [...this.#skills.values()]
        .filter((skill) => skill.trailId === trailId)
        .map(copy),
    );
  }

  getLevelsBySkill(skillId: string): Level[] {
    return ordered(
      [...this.#levels.values()]
        .filter((level) => level.skillId === skillId)
        .map(copy),
    );
  }

  getActivitiesByLevel(levelId: string): Activity[] {
    return ordered(
      [...this.#activities.values()]
        .filter((activity) => activity.levelId === levelId)
        .map(copy),
    );
  }
}
