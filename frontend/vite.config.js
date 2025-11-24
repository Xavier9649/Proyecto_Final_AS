import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],

  // El root debe ser la carpeta actual (frontend)
  root: './',

  build: {
    outDir: 'dist'
  },

  define: {
    global: 'window'
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}"
          ],
          theme: {
            extend: {},
          },
          plugins: [],
        }),
        autoprefixer(),
      ],
    },
  },
});

