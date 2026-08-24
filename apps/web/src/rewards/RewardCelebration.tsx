export interface RewardCelebrationProps {
  stars: number;
  coins: number;
}

export function RewardCelebration({ stars, coins }: RewardCelebrationProps) {
  return (
    <section
      aria-live="polite"
      className="reward-celebration"
      data-duration-ms="1400"
      role="status"
    >
      <span aria-hidden="true" className="reward-celebration__sparkles">
        ✦ ⭐ ✦
      </span>
      <h2>Você conseguiu!</h2>
      <p>
        {stars} {stars === 1 ? 'estrela' : 'estrelas'} e {coins}{' '}
        {coins === 1 ? 'moeda' : 'moedas'}
      </p>
    </section>
  );
}
