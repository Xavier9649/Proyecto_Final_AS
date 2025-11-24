import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- Importaciones de Componentes de Layout y Seguridad ---
import Layout from '../components/layout/Layout'; 
import PrivateRoute from './PrivateRoute'; 

// --- Importaciones de Vistas Públicas ---
import Home from '../pages/Home';
import Login from '../pages/Login'; 
import Register from '../pages/Register';
import Portfolio from '../pages/Portfolio';
import ProjectDetail from '../pages/ProjectDetail';
import Team from '../pages/Team'; // Página de Equipo
import Privacy from '../pages/Privacy'; // Página Legal
import Terms from '../pages/Terms';     // Página Legal
import Contact from '../pages/Contact'; // Página de Contacto
import Unauthorized from '../pages/Unauthorized'; // Página de Acceso Denegado
import CotizarProyecto from '../pages/CotizarProyecto';

// --- Importaciones de Vistas Privadas ---
import ClientQuotations from '../pages/ClientQuotations'; 
import AdminDashboard from '../pages/AdminDashboard'; 
import ArchitectDashboard from '../pages/ArchitectDashboard'; 

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
        // AnimatePresence permite animar el componente que "sale" (exit) de la vista
        <AnimatePresence mode="wait"> 
            {/* La key es CRUCIAL para que framer-motion detecte el cambio de ruta */}
            <Routes location={location} key={location.pathname}> 
                
                {/* -------------------- RUTAS PÚBLICAS -------------------- */}
                
                {/* Home y Autenticación */}
                <Route path="/" element={<Layout><AnimatedRoute><Home /></AnimatedRoute></Layout>} />
                <Route path="/login" element={<Layout><AnimatedRoute><Login /></AnimatedRoute></Layout>} />
                <Route path="/register" element={<Layout><AnimatedRoute><Register /></AnimatedRoute></Layout>} />
                
                {/* Páginas Informativas y Legales */}
                <Route path="/equipo" element={<Layout><AnimatedRoute><Team /></AnimatedRoute></Layout>} />
                <Route path="/privacy" element={<Layout><AnimatedRoute><Privacy /></AnimatedRoute></Layout>} />
                <Route path="/terms" element={<Layout><AnimatedRoute><Terms /></AnimatedRoute></Layout>} />
                <Route path="/contact" element={<Layout><AnimatedRoute><Contact /></AnimatedRoute></Layout>} />
                <Route path="/unauthorized" element={<Layout><AnimatedRoute><Unauthorized /></AnimatedRoute></Layout>} />

                
                {/* Portafolio y Cotización */}
                <Route path="/portfolio" element={<Layout><AnimatedRoute><Portfolio /></AnimatedRoute></Layout>} />
                <Route path="/portfolio/:id" element={<Layout><AnimatedRoute><ProjectDetail /></AnimatedRoute></Layout>} />

                {/* Nueva ruta de solicitud de cotización */}
                <Route 
                    path="/cotizar/:id" 
                    element={
                        <Layout>
                            <AnimatedRoute>
                                <CotizarProyecto />
                            </AnimatedRoute>
                        </Layout>
                    } 
                />

                                
                {/* -------------------- RUTAS PRIVADAS -------------------- */}
                
                {/* CLIENTE: Mis Cotizaciones */}
                <Route path="/mis-cotizaciones" element={
                    <PrivateRoute>
                        <Layout>
                            <AnimatedRoute>
                                <ClientQuotations /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />
                
                {/* ARQUITECTO: Dashboard */}
                <Route path="/architect-dashboard" element={
                    <PrivateRoute requiredRole="ARCHITECT"> 
                        <Layout>
                            <AnimatedRoute>
                                <ArchitectDashboard /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* ADMIN: Dashboard Completo */}
                <Route path="/admin" element={
                    <PrivateRoute requiredRole="ADMIN">
                        <Layout>
                            <AnimatedRoute>
                                <AdminDashboard /> 
                            </AnimatedRoute>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Ruta 404 (Siempre al final) */}
                <Route path="*" element={<Layout><AnimatedRoute><div className="text-center py-20 text-2xl text-gray-600">404: Página No Encontrada</div></AnimatedRoute></Layout>} />

            </Routes>
        </AnimatePresence>
    );
};