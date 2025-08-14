import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SettingsProvider } from './context/SettingsContext'; // ✅ Import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider> {/* ✅ Wrap App with the provider */}
      <App />
    </SettingsProvider>
  </StrictMode>
);
