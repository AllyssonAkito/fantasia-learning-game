import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

function FoundationStatus() {
  return (
    <main className="foundation-status">
      <span aria-hidden="true" className="foundation-status__sparkle">
        ✨
      </span>
      <h1>Fantasia está crescendo</h1>
      <p>A nova plataforma está sendo preparada com carinho.</p>
    </main>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Não foi possível iniciar a aplicação: elemento raiz ausente.');
}

createRoot(rootElement).render(
  <StrictMode>
    <FoundationStatus />
  </StrictMode>,
);
