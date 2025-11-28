import { Analytics } from '@vercel/analytics/next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import GitProfile from './components/gitprofile.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GitProfile config={CONFIG} />
    <Analytics />
  </React.StrictMode>,
);
