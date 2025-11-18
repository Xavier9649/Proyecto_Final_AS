/** @type {import('tailwindcss').Config} */
export default {
  // CRUCIAL: Esto le dice a Tailwind dónde buscar tus archivos de React (JSX)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}