// src/router/AppRouter.jsx - ¡VERSIÓN MODIFICADA CON RUTA DE ARQUITECTO!
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- Importaciones de Componentes de Layout y Router ---
import Layout from '../components/layout/Layout'; 
import PrivateRoute from './PrivateRoute'; 

// --- Importaciones de Vistas (Pages) ---
import Home from '../pages/Home';
import Login from '../pages/Login'; 
import Register from '../pages/Register';
import Portfolio from '../pages/Portfolio';
import ProjectDetail from '../pages/ProjectDetail';
import QuoteRequest from '../pages/QuoteRequest'; 
import ClientQuotations from '../pages/ClientQuotations'; 
import AdminDashboard from '../pages/AdminDashboard'; 
import ArchitectDashboard from '../pages/ArchitectDashboard'; // 👈 NUEVA PÁGINA

// Componente Wrapper para manejar la animación de entrada y salida de cada página
const AnimatedRoute = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }} 
    >
        {children}
    </motion.div>
);

export const AppRouter = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait"> 
            <Routes location={location} key={location.pathname}> 
                
                {/* -------------------- RUTAS PÚBLICAS -------------------- */}
                
                <Route path="/" element={<Layout><AnimatedRoute><Home /></AnimatedRoute></Layout>} />
                <Route path="/login" element={<Layout><AnimatedRoute><Login /></AnimatedRoute></Layout>} />
                <Route path="/register" element={<Layout><AnimatedRoute><Register /></AnimatedRoute></Layout>} />
                <Route path="/portfolio" element={<Layout><AnimatedRoute><Portfolio /></AnimatedRoute></Layout>} />
                <Route path="/portfolio/:id" element={<Layout><AnimatedRoute><ProjectDetail /></AnimatedRoute></Layout>} />
                <Route path="/quote" element={<Layout><AnimatedRoute><QuoteRequest /></AnimatedRoute></Layout>} />
                
                {/* -------------------- RUTAS PRIVADAS -------------------- */}
                
                <Route path="/mis-cotizaciones" element={
                    <PrivateRoute>
                        <Layout>
                            <AnimatedRoute>
                                <ClientQuotations /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />
                
                {/* 👈 NUEVA RUTA PRIVADA PARA ARQUITECTOS */}
                <Route path="/architect-dashboard" element={
                    <PrivateRoute requiredRole="architect"> {/* ROL REQUERIDO: architect */}
                        <Layout>
                            <AnimatedRoute>
                                <ArchitectDashboard /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Dashboard Admin (Requiere rol "admin") */}
                <Route path="/admin" element={
                    <PrivateRoute requiredRole="admin">
                        <Layout>
                            <AnimatedRoute>
                                <AdminDashboard /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Ruta 404 (Siempre al final) */}
                <Route path="*" element={<Layout><AnimatedRoute><div>404: Página No Encontrada</div></AnimatedRoute></Layout>} />

            </Routes>
        </AnimatePresence>
    );
};