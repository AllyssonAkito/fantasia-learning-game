import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InMemoryContentCatalog, mvpCatalogSeed } from '@fantasia/content';

import { FantasiaApp } from './app/FantasiaApp';
import { LearningPathProgressStore } from './learning-path/LearningPathProgressStore';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Não foi possível iniciar a aplicação: elemento raiz ausente.',
  );
}

const catalog = new InMemoryContentCatalog(mvpCatalogSeed);
const progressStore = new LearningPathProgressStore();

createRoot(rootElement).render(
  <StrictMode>
    <FantasiaApp
      catalog={catalog}
      profiles={[
        {
          id: 'profile_00000000-0000-4000-8000-000000000001',
          displayName: 'Melina',
          avatar: '🐰',
        },
      ]}
      progressStore={progressStore}
    />
  </StrictMode>,
);
