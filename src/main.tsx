import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HelloPage from '@/pages/HelloPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelloPage />
  </StrictMode>
);
