// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ---------------------------------------------------
  base: '/', // <--- ADICIONE ESTA LINHA
  // ---------------------------------------------------
  server: {
    // Você pode remover a configuração de porta se o 5173 estiver funcionando
    // port: 5173, 
  }
});