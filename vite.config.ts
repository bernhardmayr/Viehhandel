import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base MUSS dem Repo-Namen entsprechen (Project-Site):
// https://bernhardmayr.github.io/viehhandel/
export default defineConfig({
  plugins: [react()],
  base: '/viehhandel/',
});
