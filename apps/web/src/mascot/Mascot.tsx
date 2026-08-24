import { mascotAssets, type MascotAvatarId } from './mascot-assets';

export type MascotState = 'neutral' | 'instruction' | 'hint' | 'celebration';

export interface MascotProps {
  avatarId: MascotAvatarId;
  state: MascotState;
  message?: string;
  reducedMotion?: boolean;
}

const stateLabels: Record<MascotState, string> = {
  neutral: 'está pertinho',
  instruction: 'mostra a brincadeira',
  hint: 'mostra uma dica',
  celebration: 'comemora com você',
};

export function Mascot({
  avatarId,
  state,
  message,
  reducedMotion = false,
}: MascotProps) {
  const mascot = mascotAssets[avatarId];
  return (
    <aside
      aria-label={`${mascot.label} ${stateLabels[state]}`}
      className={`mascot mascot--${state}${reducedMotion ? ' mascot--reduced-motion' : ''}`}
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-state={state}
    >
      <div className="mascot__portrait">
        <img alt={mascot.label} src={mascot.src} />
        <span aria-hidden="true" className="mascot__emotion">
          {state === 'celebration' ? '✨' : state === 'hint' ? '💡' : '♥'}
        </span>
      </div>
      {message ? (
        <p aria-live="polite" className="mascot__speech">
          {message}
        </p>
      ) : null}
    </aside>
  );
}
