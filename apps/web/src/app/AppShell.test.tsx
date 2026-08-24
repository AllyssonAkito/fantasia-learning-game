import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('comunica carregamento sem expor uma tela vazia', () => {
    render(<AppShell state={{ status: 'loading' }} />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('heading', { name: 'Preparando tudo' }),
    ).toBeVisible();
  });

  it('oferece recuperação amigável em caso de erro', () => {
    const onRetry = vi.fn();
    render(<AppShell state={{ status: 'error', onRetry }} />);

    fireEvent.click(screen.getByRole('button', { name: /tentar de novo/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('apresenta o estado vazio de forma segura para crianças', () => {
    render(<AppShell state={{ status: 'empty' }} />);

    expect(
      screen.getByRole('heading', { name: 'Tudo pronto para crescer' }),
    ).toBeVisible();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'false');
  });

  it('compõe conteúdo carregado sem conhecer a atividade', () => {
    render(
      <AppShell
        state={{
          status: 'ready',
          content: (
            <section aria-label="Atividade de exemplo">Conteúdo</section>
          ),
        }}
      />,
    );

    expect(screen.getByLabelText('Atividade de exemplo')).toBeVisible();
  });
});
