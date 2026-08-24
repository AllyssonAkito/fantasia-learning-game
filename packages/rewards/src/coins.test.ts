import { describe, expect, it } from 'vitest';
import { CoinLedger } from './coins';

const input = {
  profileId: 'profile_347c3e43-1d1c-4ca9-a56f-e01b56d28071',
  activityId: 'activity.letters.a.001',
  activityVersion: 1,
  coins: 4,
  grantedAt: '2026-08-24T12:00:00.000Z',
};

describe('CoinLedger', () => {
  it('mantém saldo consistente e extrato auditável', () => {
    const ledger = new CoinLedger();
    ledger.grant(input);
    ledger.grant(input);
    expect(ledger.balance(input.profileId)).toBe(4);
    expect(ledger.statement(input.profileId)).toEqual([
      expect.objectContaining({ coins: 4, kind: 'earned' }),
    ]);
  });

  it('isola o saldo por perfil', () => {
    const ledger = new CoinLedger();
    ledger.grant(input);
    expect(ledger.balance('profile_11111111-1111-4111-8111-111111111111')).toBe(
      0,
    );
  });
});
