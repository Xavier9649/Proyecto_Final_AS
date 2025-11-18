// src/services/api.js
import axios from 'axios';

// **IMPORTANTE:** Asegúrate de que esta URL base sea la correcta 
// donde está corriendo el Backend de tu compañero (puerto 3000, 8080, etc.)
const API_URL = 'http://localhost:4000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Lógica para enviar el token de autenticación
api.interceptors.request.use((config) => {
  // El token se guarda en el almacenamiento local después del login
  const token = localStorage.getItem('authToken'); 
  if (token) {
    // Si existe un token, se adjunta al header 'Authorization'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;