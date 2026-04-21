// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function enableMocking() {
  const shouldEnable = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === 'true';
  console.log('[MSW] Should enable?', shouldEnable, {
    DEV: import.meta.env.DEV,
    VITE_ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW,
  });

  if (!shouldEnable) {
    console.log('[MSW] Mocking disabled.');
    return;
  }

  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[MSW] Mocking enabled successfully.');
  } catch (error) {
    console.error('[MSW] Failed to start:', error);
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
