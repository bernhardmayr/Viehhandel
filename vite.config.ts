import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relativer Base-Pfad ('./') => Assets werden relativ geladen und funktionieren
// unter jeder Project-Site-URL, unabhängig von Groß-/Kleinschreibung des Repo-Namens
// (z.B. /Viehhandel/ oder /viehhandel/). Mit HashRouter bleibt das Dokument immer
// auf der index.html, daher lösen relative Pfade korrekt auf.
export default defineConfig({
  plugins: [react()],
  base: './',
});
