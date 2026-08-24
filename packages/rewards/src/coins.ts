export interface CoinGrantInput {
  profileId: string;
  activityId: string;
  activityVersion: number;
  coins: number;
  grantedAt: string;
}

export interface CoinTransaction extends CoinGrantInput {
  transactionId: string;
  kind: 'earned';
}

export class CoinLedger {
  readonly #transactions = new Map<string, CoinTransaction>();

  grant(input: CoinGrantInput): CoinTransaction {
    if (!Number.isInteger(input.coins) || input.coins < 0)
      throw new Error('Moedas devem ser um número inteiro não negativo.');
    const transactionId = `${input.profileId}:${input.activityId}:v${input.activityVersion}`;
    const existing = this.#transactions.get(transactionId);
    if (existing) return { ...existing };
    const transaction: CoinTransaction = {
      ...input,
      kind: 'earned',
      transactionId,
    };
    this.#transactions.set(transactionId, transaction);
    return { ...transaction };
  }

  statement(profileId: string): CoinTransaction[] {
    return [...this.#transactions.values()]
      .filter((transaction) => transaction.profileId === profileId)
      .map((transaction) => ({ ...transaction }));
  }

  balance(profileId: string): number {
    return this.statement(profileId).reduce(
      (total, transaction) => total + transaction.coins,
      0,
    );
  }
}
