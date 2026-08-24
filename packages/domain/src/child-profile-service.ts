import { childProfileSchema, type ChildProfile } from './child-profile';

export interface ChildProfileRepository {
  findById(id: string): Promise<ChildProfile | null>;
  listByResponsible(responsibleId: string): Promise<ChildProfile[]>;
  save(profile: ChildProfile): Promise<ChildProfile>;
}

export interface CreateChildProfileInput {
  displayName: string;
  ageBand: ChildProfile['ageBand'];
  avatarId: string;
  preferences: ChildProfile['preferences'];
}

export type UpdateChildProfileInput = Partial<CreateChildProfileInput>;

function copy(profile: ChildProfile): ChildProfile {
  return {
    ...profile,
    preferences: { ...profile.preferences },
  };
}

export class InMemoryChildProfileRepository implements ChildProfileRepository {
  readonly #records = new Map<string, ChildProfile>();

  async findById(id: string): Promise<ChildProfile | null> {
    const profile = this.#records.get(id);
    return profile ? copy(profile) : null;
  }

  async listByResponsible(responsibleId: string): Promise<ChildProfile[]> {
    return [...this.#records.values()]
      .filter((profile) => profile.responsibleId === responsibleId)
      .map(copy);
  }

  async save(candidate: ChildProfile): Promise<ChildProfile> {
    const profile = childProfileSchema.parse(candidate);
    this.#records.set(profile.id, copy(profile));
    return copy(profile);
  }
}

export class ChildProfileService {
  constructor(
    private readonly repository: ChildProfileRepository,
    private readonly createId: () => string,
    private readonly now: () => string,
  ) {}

  async create(
    responsibleId: string,
    input: CreateChildProfileInput,
  ): Promise<ChildProfile> {
    const timestamp = this.now();
    return this.repository.save(
      childProfileSchema.parse({
        schemaVersion: 1,
        id: this.createId(),
        responsibleId,
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      }),
    );
  }

  async update(
    responsibleId: string,
    profileId: string,
    changes: UpdateChildProfileInput,
  ): Promise<ChildProfile> {
    const current = await this.repository.findById(profileId);
    if (
      !current ||
      current.responsibleId !== responsibleId ||
      current.archivedAt
    ) {
      throw new Error('Perfil indisponível para edição.');
    }

    return this.repository.save(
      childProfileSchema.parse({
        ...current,
        ...changes,
        preferences: changes.preferences ?? current.preferences,
        updatedAt: this.now(),
      }),
    );
  }

  async archive(
    responsibleId: string,
    profileId: string,
    adultConfirmed: boolean,
  ): Promise<ChildProfile> {
    if (!adultConfirmed) {
      throw new Error('A confirmação adulta é obrigatória.');
    }

    const current = await this.repository.findById(profileId);
    if (!current || current.responsibleId !== responsibleId) {
      throw new Error('Perfil não encontrado.');
    }
    if (current.archivedAt) return current;

    const timestamp = this.now();
    return this.repository.save(
      childProfileSchema.parse({
        ...current,
        archivedAt: timestamp,
        updatedAt: timestamp,
      }),
    );
  }
}
