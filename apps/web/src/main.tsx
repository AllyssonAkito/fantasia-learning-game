import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppShell } from './app/AppShell';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Não foi possível iniciar a aplicação: elemento raiz ausente.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <AppShell state={{ status: 'empty' }} />
  </StrictMode>,
);
