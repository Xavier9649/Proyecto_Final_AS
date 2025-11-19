// 🚨 PARCHE: Asegura compatibilidad con librerías antiguas de Node (como algunas de auth)
window.global = window;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 👇 ESTA LÍNEA ES CRÍTICA: Importa los estilos de Tailwind
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)