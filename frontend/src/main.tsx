import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { store, persistor } from './store';
import router from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster
          richColors
          toastOptions={{
            classNames: {
              toast: 'sonner-toast',
              success: 'sonner-success',
              error: 'sonner-error',
            },
            style: {
              boxShadow: '0 6px 18px rgba(2,6,23,0.12)',
            },
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
