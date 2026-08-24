import type { ChildProfile } from './child-profile';
import type { ChildProfileRepository } from './child-profile-service';

export type ChildProfileSessionState =
  | { status: 'none' }
  | { status: 'active'; profile: ChildProfile }
  | { status: 'error'; message: string };

export class ChildProfileSession {
  #state: ChildProfileSessionState = { status: 'none' };

  constructor(private readonly repository: ChildProfileRepository) {}

  get state(): ChildProfileSessionState {
    return this.#state.status === 'active'
      ? {
          status: 'active',
          profile: {
            ...this.#state.profile,
            preferences: { ...this.#state.profile.preferences },
          },
        }
      : { ...this.#state };
  }

  async select(
    responsibleId: string,
    profileId: string,
  ): Promise<ChildProfileSessionState> {
    const profile = await this.repository.findById(profileId);
    if (
      !profile ||
      profile.responsibleId !== responsibleId ||
      profile.archivedAt
    ) {
      this.#state = {
        status: 'error',
        message: 'Este perfil não está disponível.',
      };
      return this.state;
    }

    this.#state = { status: 'active', profile };
    return this.state;
  }

  clear(): ChildProfileSessionState {
    this.#state = { status: 'none' };
    return this.state;
  }
}
