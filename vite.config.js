import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Esto es el valor por defecto. Si dice otra cosa, cámbialo a 'dist' o ajusta Vercel.
  },
  
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