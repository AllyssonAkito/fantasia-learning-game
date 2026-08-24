import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Harness } from './Harness';
import './styles.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);
