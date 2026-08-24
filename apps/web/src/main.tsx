import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { FoundationStatus } from './FoundationStatus';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Não foi possível iniciar a aplicação: elemento raiz ausente.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <FoundationStatus />
  </StrictMode>,
);
