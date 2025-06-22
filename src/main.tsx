import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
  <GoogleOAuthProvider clientId="1041815008887-kfjrqd5krk8upatj0sgkoc7i0sfi4iv1.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </StrictMode>
);
