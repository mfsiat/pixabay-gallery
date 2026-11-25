import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/tailwind.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
