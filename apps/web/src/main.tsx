import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  buildLearningPathView,
  exampleCatalogSeed,
  InMemoryContentCatalog,
} from '@fantasia/content';

import { AppShell } from './app/AppShell';
import { LearningPath } from './learning-path/LearningPath';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Não foi possível iniciar a aplicação: elemento raiz ausente.',
  );
}

const catalog = new InMemoryContentCatalog(exampleCatalogSeed);
const learningPath = buildLearningPathView(catalog, 'course.logic');

createRoot(rootElement).render(
  <StrictMode>
    <AppShell
      state={{
        status: 'ready',
        content: <LearningPath path={learningPath} />,
      }}
    />
  </StrictMode>,
);
