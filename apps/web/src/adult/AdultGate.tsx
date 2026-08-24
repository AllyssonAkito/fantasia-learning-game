import { useRef, useState } from 'react';

export interface AdultGateProps {
  onUnlock: () => void;
  holdDurationMs?: number;
}

export function AdultGate({ onUnlock, holdDurationMs = 2000 }: AdultGateProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const beginHold = () => {
    cancelHold();
    timer.current = setTimeout(() => {
      timer.current = null;
      setOpen(false);
      onUnlock();
    }, holdDurationMs);
  };

  return (
    <>
      <button
        aria-label="Abrir acesso do responsável"
        className="adult-access-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span aria-hidden="true">🔒</span>
      </button>
      {open ? (
        <div
          aria-labelledby="adult-gate-title"
          className="adult-gate"
          role="dialog"
        >
          <div className="adult-gate__card">
            <span aria-hidden="true" className="adult-gate__icon">
              🖐️
            </span>
            <h2 id="adult-gate-title">Área do responsável</h2>
            <p>Segure o botão até completar para continuar.</p>
            <button
              className="adult-gate__hold"
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') beginHold();
              }}
              onKeyUp={cancelHold}
              onPointerCancel={cancelHold}
              onPointerDown={beginHold}
              onPointerLeave={cancelHold}
              onPointerUp={cancelHold}
              type="button"
            >
              Segure por 2 segundos
            </button>
            <button
              className="adult-gate__cancel"
              onClick={() => {
                cancelHold();
                setOpen(false);
              }}
              type="button"
            >
              Voltar para a brincadeira
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
