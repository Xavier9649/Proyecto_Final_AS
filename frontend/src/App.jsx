// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './context/AuthContext'; // Importamos el proveedor

function App() {
  return (
    <Router>
      {/* El AuthProvider envuelve toda la aplicación para dar acceso al estado */}
      <AuthProvider> 
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;