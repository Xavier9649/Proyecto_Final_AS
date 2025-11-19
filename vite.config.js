import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  
  // Carpeta raíz para Vite
  root: './frontend', 
  
  define: {
    global: 'window',
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss({
          // 🚨 AQUÍ ESTABA EL PROBLEMA:
          // Como este archivo está en la raíz, debemos apuntar a la carpeta frontend
          content: [
            "./frontend/index.html", 
            "./frontend/src/**/*.{js,ts,jsx,tsx}"
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