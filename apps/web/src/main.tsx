import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InMemoryContentCatalog, mvpCatalogSeed } from '@fantasia/content';

import { AppShell } from './app/AppShell';
import { AdultGate } from './adult/AdultGate';
import { LiveLearningPath } from './learning-path/LiveLearningPath';
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
    <AppShell
      adultAccess={<AdultGate onUnlock={() => undefined} />}
      state={{
        status: 'ready',
        content: (
          <LiveLearningPath
            catalog={catalog}
            courseId="course.logic"
            store={progressStore}
          />
        ),
      }}
    />
  </StrictMode>,
);
