export interface StarGrantInput {
  profileId: string;
  activityId: string;
  activityVersion: number;
  stars: number;
  grantedAt: string;
}

export interface StarGrant extends StarGrantInput {
  idempotencyKey: string;
}

export class StarLedger {
  readonly #grants = new Map<string, StarGrant>();

  grant(input: StarGrantInput): StarGrant {
    if (!Number.isInteger(input.stars) || input.stars < 0 || input.stars > 3)
      throw new Error('A atividade deve conceder entre 0 e 3 estrelas.');
    const key = `${input.profileId}:${input.activityId}:v${input.activityVersion}`;
    const existing = this.#grants.get(key);
    if (existing) return { ...existing };
    const grant = { ...input, idempotencyKey: key };
    this.#grants.set(key, grant);
    return { ...grant };
  }

  totalForProfile(profileId: string): number {
    return [...this.#grants.values()]
      .filter((grant) => grant.profileId === profileId)
      .reduce((total, grant) => total + grant.stars, 0);
  }
}
