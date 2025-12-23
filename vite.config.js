import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basic Vite config for a React + JS setup
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});

