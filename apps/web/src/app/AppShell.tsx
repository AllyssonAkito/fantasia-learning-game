import type { ReactNode } from 'react';

export type AppShellState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; onRetry: () => void }
  | { status: 'ready'; content: ReactNode };

export interface AppShellProps {
  state: AppShellState;
  adultAccess?: ReactNode;
}

interface SafeStateProps {
  icon: string;
  title: string;
  message: string;
  busy?: boolean;
  action?: ReactNode;
}

function SafeState({
  icon,
  title,
  message,
  busy = false,
  action,
}: SafeStateProps) {
  return (
    <section
      aria-busy={busy}
      aria-live="polite"
      className="safe-state"
      role="status"
    >
      <span aria-hidden="true" className="safe-state__icon">
        {icon}
      </span>
      <h1>{title}</h1>
      <p>{message}</p>
      {action}
    </section>
  );
}

function ShellContent({ state }: AppShellProps) {
  switch (state.status) {
    case 'loading':
      return (
        <SafeState
          busy
          icon="✨"
          message="Só um instantinho. Estamos preparando a brincadeira."
          title="Preparando tudo"
        />
      );
    case 'error':
      return (
        <SafeState
          action={
            <button
              className="primary-action"
              onClick={state.onRetry}
              type="button"
            >
              <span aria-hidden="true">↻</span>
              Tentar de novo
            </button>
          }
          icon="🌦️"
          message="A brincadeira fez uma pausa. Está tudo bem: podemos tentar novamente."
          title="Ops, uma nuvem passou"
        />
      );
    case 'empty':
      return (
        <SafeState
          icon="🌱"
          message="As primeiras aventuras vão aparecer aqui em breve."
          title="Tudo pronto para crescer"
        />
      );
    case 'ready':
      return <>{state.content}</>;
  }
}

export function AppShell({ state, adultAccess }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <a aria-label="Fantasia — início" className="brand" href="/">
          <span aria-hidden="true" className="brand__mark">
            ✦
          </span>
          <span>Fantasia</span>
        </a>
        {adultAccess}
      </header>
      <main className="app-shell__main">
        <ShellContent state={state} />
      </main>
    </div>
  );
}
