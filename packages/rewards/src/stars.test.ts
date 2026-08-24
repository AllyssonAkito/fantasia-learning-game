import { describe, expect, it } from 'vitest';
import { StarLedger } from './stars';

const input = {
  profileId: 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071',
  activityId: 'activity.letters.a.001',
  activityVersion: 1,
  stars: 2,
  grantedAt: '2026-08-24T12:00:00.000Z',
};

describe('StarLedger', () => {
  it('concede estrelas definidas pelo conteúdo uma única vez', () => {
    const ledger = new StarLedger();
    const first = ledger.grant(input);
    const repeated = ledger.grant({ ...input, stars: 3 });
    expect(repeated).toEqual(first);
    expect(ledger.totalForProfile(input.profileId)).toBe(2);
  });

  it('recusa valores fora da faixa simples', () => {
    expect(() => new StarLedger().grant({ ...input, stars: 4 })).toThrow(
      '0 e 3',
    );
  });
});
