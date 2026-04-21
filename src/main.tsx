import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function enableMocking() {
  // Always enable MSW in production (Vercel).
  // In local development, it's already enabled via import.meta.env.DEV.
  const isProduction = !import.meta.env.DEV;

  // You can optionally disable mocking by adding ?mock=false to the URL
  const urlParams = new URLSearchParams(window.location.search);
  const mockParam = urlParams.get('mock');
  const shouldEnable = isProduction ? mockParam !== 'false' : true;

  if (!shouldEnable) {
    console.log('[MSW] Mocking disabled via URL parameter.');
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
