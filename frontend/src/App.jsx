// src/App.jsx

import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // <AppRoutes> é envolvido por <BrowserRouter> e <AuthProvider> em main.jsx
    <AppRoutes />
  );
}

export default App;