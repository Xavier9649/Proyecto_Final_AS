// src/pages/AdminDashboard.jsx
// Panel de Admin con gestión de cotizaciones, portafolio, arquitectos y auditoría

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaPlus,
  FaList,
  FaTrashAlt,
  FaEdit,
  FaSpinner,
  FaUsers,
  FaUserTie,
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
  FaHistory,
  FaSyncAlt,
} from "react-icons/fa";

import quotationService from "../services/quotationService";
import userService from "../services/userService";
import projectService from "../services/projectService";
import auditoriaService from "../services/auditoriaService";
import notificationUtils from "../utils/notificationUtils";
import { useAuth } from "../context/AuthContext";


const initialNewProjectState = {
  titulo: "",
  descripcionCorta: "",
  descripcionLarga: "",
  ubicacion: "",
  fechaInicio: "",
  fechaTermino: "",
  categoria: "",
  estado: "PLANIFICACION",
  clienteId: "",
};

const AdminDashboard = () => {
  const [architectToEdit, setArchitectToEdit] = useState(null);
  const [newArchitect, setNewArchitect] = useState({

  nombre: "",
  email: "",
  password: ""
  });

  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("quotes");

  // --- Estados de Datos ---
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [architects, setArchitects] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  // --- Estados de Control ---
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedArchitectId, setSelectedArchitectId] = useState({});
  const [editProjectId, setEditProjectId] = useState(null);
  const [newProjectData, setNewProjectData] = useState(initialNewProjectState);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // -------------------------
  // 1. CARGA INICIAL
  // -------------------------

  const fetchInitialData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [allQuotes, availableArchitects, fetchedProjects] =
        await Promise.all([
          quotationService.getQuotations(),
          userService.getArchitects(),
          projectService.getProjects(),
        ]);

      console.log("COTIZACIONES:", allQuotes);

      setQuotations(allQuotes);
      setArchitects(availableArchitects || []);
      setProjects(fetchedProjects || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos iniciales: " + err.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuditLog = useCallback(async () => {
    try {
      setAuditLoading(true);
      const logs = await auditoriaService.getAuditLog();
      setAuditLog(logs || []);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: `Error al cargar auditoría: ${err.toString()}`,
      });
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Cargar auditoría cuando se entra a la pestaña "auditoria"
  useEffect(() => {
    if (activeTab === "auditoria" && auditLog.length === 0) {
      fetchAuditLog();
    }
  }, [activeTab, auditLog.length, fetchAuditLog]);

  // -------------------------
  // 2. LÓGICA DE COTIZACIONES
  // -------------------------

  const handleAssignment = async (quotationId) => {
    const architectId = selectedArchitectId[quotationId];
    if (!architectId) return;

    setLoading(true);
    setMessage(null);

    try {
      const updatedQuote =
        await quotationService.assignArchitectToQuotation(
          quotationId,
          architectId
        );
      const assignedArchitect = architects.find(
        (a) => a.id === Number(architectId)
      );

      // Log de auditoría
      await auditoriaService.logActivity(
        user?.id,
        "ASIGNAR_ARQUITECTO",
        "Cotizacion",
        quotationId,
        {
          arquitectoAsignadoId: architectId,
          estado: updatedQuote?.estado,
        }
      );

      // Notificación de prueba (ajusta según tu backend real)
      await notificationUtils.triggerQuotationConfirmationEmail({
        email: assignedArchitect?.email || "N/A",
        nombre: assignedArchitect?.name || "Arquitecto",
        cotizacionId: quotationId,
        action: "ASIGNADA_A_ARQUITECTO",
      });

      setMessage({
        type: "success",
        text: `Cotización #${quotationId} asignada a ${
          assignedArchitect?.name || "Arquitecto"
        }.`,
      });

      setQuotations((prev) =>
        prev.map((q) =>
          q.id === quotationId
            ? { ...q, estado: updatedQuote?.estado || "ASIGNADA" }
            : q
        )
      );
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const handleArchitectSelect = (quotationId, archId) => {
    setSelectedArchitectId((prev) => ({
      ...prev,
      [quotationId]: archId,
    }));
  };

  // ✅ ELIMINAR COTIZACIÓN (CRUD desde Admin)
  const handleDeleteQuotation = async (quotationId) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la cotización #${quotationId}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setLoading(true);
    setMessage(null);

    try {
      await quotationService.deleteQuotation(quotationId);

      setQuotations((prev) => prev.filter((q) => q.id !== quotationId));

      setMessage({
        type: "success",
        text: `Cotización #${quotationId} eliminada correctamente.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error al eliminar cotización: ${err.toString()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 3. LÓGICA DE PROYECTOS (CRUD)
  // -------------------------

  const handleDeleteProject = async (projectId) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el proyecto #${projectId}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setLoading(true);
    setMessage(null);

    try {
      await projectService.deleteProject(projectId);

      await auditoriaService.logActivity(
        user?.id,
        "ELIMINAR_PROYECTO",
        "Proyecto",
        projectId,
        { mensaje: "Proyecto eliminado desde Panel Admin" }
      );

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setMessage({
        type: "success",
        text: `Proyecto #${projectId} eliminado correctamente.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error al eliminar proyecto: ${err.toString()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      setMessage(null);
      setLoading(true);

      const createdProject = await projectService.createProject({
        ...newProjectData,
      });

      // Subida de imágenes si se seleccionaron archivos
      if (selectedFiles.length > 0 && createdProject?.id) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("imagenes", file);
        });

        await projectService.uploadImages(createdProject.id, formData);
      }

      await auditoriaService.logActivity(
        user?.id,
        "CREAR_PROYECTO",
        "Proyecto",
        createdProject?.id,
        {
          titulo: newProjectData.titulo,
          ubicacion: newProjectData.ubicacion,
        }
      );

      setProjects((prev) => [...prev, createdProject]);
      setMessage({
        type: "success",
        text: "Proyecto creado correctamente.",
      });

      setNewProjectData(initialNewProjectState);
      setSelectedFiles([]);
      setActiveTab("projects");
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error al crear proyecto: ${err.toString()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editProjectId) return;

    try {
      setMessage(null);
      setLoading(true);

      const updatedProject = await projectService.updateProject(
        editProjectId,
        newProjectData
      );

      await auditoriaService.logActivity(
        user?.id,
        "ACTUALIZAR_PROYECTO",
        "Proyecto",
        updatedProject?.id,
        {
          titulo: newProjectData.titulo,
          ubicacion: newProjectData.ubicacion,
        }
      );

      setProjects((prev) =>
        prev.map((p) => (p.id === editProjectId ? updatedProject : p))
      );
      setMessage({
        type: "success",
        text: "Proyecto actualizado correctamente.",
      });

      setEditProjectId(null);
      setNewProjectData(initialNewProjectState);
      setSelectedFiles([]);
      setActiveTab("projects");
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error al actualizar proyecto: ${err.toString()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImagesForProject = async (projectId) => {
    if (!selectedFiles.length) {
      alert("Debes seleccionar al menos una imagen.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("imagenes", file);
      });

      await projectService.uploadImages(projectId, formData);

      await auditoriaService.logActivity(
        user?.id,
        "SUBIR_IMAGENES_PROYECTO",
        "Proyecto",
        projectId,
        { cantidadImagenes: selectedFiles.length }
      );

      setMessage({
        type: "success",
        text: "Imágenes subidas correctamente.",
      });

      setSelectedFiles([]);
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error al subir imágenes: ${err.toString()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProjectClick = (project) => {
    setEditProjectId(project.id);

    setNewProjectData({
      titulo: project.nombre || "",
      descripcionCorta: project.descripcionCorta || "",
      descripcionLarga: project.descripcion || "",
      ubicacion: project.ubicacion || "",
      fechaInicio: project.fechaInicio || "",
      fechaTermino: project.fechaFinEstimada || "",
      categoria: project.categoria || "",
      estado: project.estado || "PLANIFICACION",
      clienteId: "",
    });

    setActiveTab("edit_project");
  };

    const handleCreateArchitect = async () => {
    try {
      await userService.createArchitect(newArchitect);

      setMessage({
        type: "success",
        text: "Arquitecto creado correctamente."
      });

      setNewArchitect({ nombre: "", email: "", password: "" });
      await fetchInitialData(); // recarga arquitectos
      setActiveTab("architects");

    } catch (err) {
      setMessage({
        type: "error",
        text: `Error creando arquitecto: ${err.toString()}`
      });
    }
  };

    const handleUpdateArchitect = async () => {
    if (!architectToEdit) return;

    try {
      await userService.updateArchitect(architectToEdit.id, {
        nombre: architectToEdit.nombre,
        email: architectToEdit.email,
      });

      setMessage({
        type: "success",
        text: "Arquitecto actualizado correctamente."
      });

      setArchitectToEdit(null);
      await fetchInitialData();
      setActiveTab("architects");

    } catch (err) {
      setMessage({
        type: "error",
        text: `Error actualizando arquitecto: ${err.toString()}`
      });
    }
  };

    const handleDeleteArchitect = async (id) => {
    if (!window.confirm("¿Eliminar este arquitecto?")) return;

    try {
      await userService.deleteArchitect(id);

      setMessage({
        type: "success",
        text: "Arquitecto eliminado."
      });

      await fetchInitialData();

    } catch (err) {
      setMessage({
        type: "error",
        text: `Error eliminando arquitecto: ${err.toString()}`
      });
    }
  };


  // -------------------------
  // 4. RENDERIZADOS DE TABS
  // -------------------------

  const renderQuotesTab = () => {
    const pendingQuotes = quotations.filter(
      (q) => q.estado === "PENDIENTE"
    );

    return (
      <section>
        <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b pb-2">
          Cotizaciones Pendientes de Asignación ({pendingQuotes.length})
        </h2>

        {pendingQuotes.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <FaCheck className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700">
              ¡Todas las cotizaciones han sido asignadas!
            </h3>
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
                    <h2 className="text-xl font-bold text-gray-900">
                      Solicitud #{q.id} – Cliente:{" "}
                      {q.cliente?.nombre} {q.cliente?.apellido}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Email: {q.cliente?.email || "No disponible"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Fecha de Solicitud:{" "}
                      {new Date(q.createdAt).toLocaleDateString()}
                    </p>

                    {q.proyectoInteres && (
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Proyecto:</strong>{" "}
                        {q.proyectoInteres.nombre}
                      </p>
                    )}
                  </div>

                  <span className="py-1 px-3 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {q.estado}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">
                  <strong>Mensaje enviado:</strong>{" "}
                  {q.mensaje || "Sin mensaje"}
                </p>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-600 font-medium flex items-center">
                      <FaUserTie className="mr-2 text-indigo-500" /> Asignar:
                    </label>

                    <select
                      value={selectedArchitectId[q.id] || ""}
                      onChange={(e) =>
                        handleArchitectSelect(q.id, e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      {architects.length === 0 ? (
                        <option value="">
                          No hay arquitectos disponibles
                        </option>
                      ) : (
                        architects.map((arch) => (
                          <option key={arch.id} value={arch.id}>
                            {arch.name || arch.email}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleAssignment(q.id)}
                      disabled={
                        loading ||
                        architects.length === 0 ||
                        !selectedArchitectId[q.id]
                      }
                      className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Asignar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDeleteQuotation(q.id)}
                      disabled={loading}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Eliminar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // ✅ NUEVA PESTAÑA: ARQUITECTOS
    const renderArchitectsTab = () => {
    return (
      <section>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-gray-700 flex items-center">
            <FaUserTie className="mr-3 text-indigo-600" />
            Arquitectos Registrados ({architects.length})
          </h2>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => {
              setNewArchitect({ nombre: "", email: "", password: "" });
              setActiveTab("new_architect");
            }}
          >
            + Nuevo Arquitecto
          </button>
        </div>

        {architects.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-3" />
            <p className="text-gray-700 text-lg">
              No hay arquitectos registrados en el sistema.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {architects.map((a) => (
              <motion.div
                key={a.id}
                className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {a.nombre || a.name || "Sin nombre"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {a.email || "Sin correo"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setArchitectToEdit({
                        id: a.id,
                        nombre: a.nombre || a.name || "",
                        email: a.email || ""
                      });
                      setActiveTab("edit_architect");
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Editar
                  </button>



                  <button
                    onClick={() => handleDeleteArchitect(a.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderNewArchitectTab = () => (
    <section className="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registrar Arquitecto</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          value={newArchitect.nombre}
          onChange={(e) =>
            setNewArchitect({ ...newArchitect, nombre: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 border rounded"
          value={newArchitect.email}
          onChange={(e) =>
            setNewArchitect({ ...newArchitect, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={newArchitect.password}
          onChange={(e) =>
            setNewArchitect({ ...newArchitect, password: e.target.value })
          }
        />

        <button
          className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700"
          onClick={handleCreateArchitect}
        >
          Registrar
        </button>
      </div>
    </section>
  );

    const renderEditArchitectTab = () => {
    if (!architectToEdit) {
      return (
        <section className="p-8 bg-white rounded-xl shadow text-center">
          <p className="text-gray-600">No hay arquitecto seleccionado.</p>
          <button
            className="mt-4 text-indigo-600 hover:underline"
            onClick={() => setActiveTab("architects")}
          >
            Volver a la lista
          </button>
        </section>
      );
    }

    return (
      <section className="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Editar Arquitecto #{architectToEdit.id}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={architectToEdit.nombre}
            onChange={(e) =>
              setArchitectToEdit({
                ...architectToEdit,
                nombre: e.target.value,
              })
            }
          />

          <input
            type="email"
            className="w-full p-2 border rounded"
            value={architectToEdit.email}
            onChange={(e) =>
              setArchitectToEdit({
                ...architectToEdit,
                email: e.target.value,
              })
            }
          />

          <button
            className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700"
            onClick={handleUpdateArchitect}
          >
            Guardar Cambios
          </button>
        </div>
      </section>
    );
  };


  const renderProjectsTab = () => {
    return (
      <section>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-gray-700">
            Gestión de Portafolio ({projects.length})
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-green-700"
            onClick={() => {
              setEditProjectId(null);
              setNewProjectData(initialNewProjectState);
              setActiveTab("create_project");
            }}
          >
            <FaPlus className="mr-2" /> Nuevo Proyecto
          </motion.button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow">
            <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
            <p className="text-gray-700 text-xl">
              No hay proyectos registrados en el portafolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-gray-100"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {p.nombre}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    {p.descripcionCorta || p.descripcion?.slice(0, 120) + "..."}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Ubicación:</strong> {p.ubicacion}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Estado:</strong> {p.estado}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Fechas:</strong>{" "}
                    {p.fechaInicio
                      ? new Date(p.fechaInicio).toLocaleDateString()
                      : "Sin inicio"}{" "}
                    -{" "}
                    {p.fechaFinEstimada
                      ? new Date(p.fechaFinEstimada).toLocaleDateString()
                      : "Sin fin"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-2 rounded-lg flex items-center text-sm hover:bg-gray-200"
                    >
                      <FaUpload className="mr-2" />
                      <span>Subir Imágenes</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </motion.label>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleUploadImagesForProject(p.id)}
                      disabled={loading || selectedFiles.length === 0}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Guardar Imágenes
                    </motion.button>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-blue-600 p-2 rounded-full hover:bg-blue-50 transition"
                      onClick={() => handleEditProjectClick(p)}
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderCreateProjectTab = () => {
    return (
      <section>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-gray-700">
            Crear Nuevo Proyecto
          </h2>
          <button
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => setActiveTab("projects")}
          >
            Volver a Portafolio
          </button>
        </div>

        <ProjectForm
          newProjectData={newProjectData}
          onChange={handleNewProjectChange}
          onFileChange={handleFileChange}
          selectedFiles={selectedFiles}
          onSubmit={handleCreateProject}
          loading={loading}
          submitLabel="Crear Proyecto"
        />
      </section>
    );
  };

  const renderEditProjectTab = () => {
    if (!editProjectId) {
      return (
        <div className="p-8 bg-white rounded-xl shadow text-center">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Ningún proyecto seleccionado para edición.
          </h2>
          <button
            className="mt-4 text-indigo-600 hover:underline"
            onClick={() => setActiveTab("projects")}
          >
            Volver al Portafolio
          </button>
        </div>
      );
    }

    return (
      <section>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-gray-700">
            Editar Proyecto #{editProjectId}
          </h2>
          <button
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => {
              setEditProjectId(null);
              setNewProjectData(initialNewProjectState);
              setActiveTab("projects");
            }}
          >
            Cancelar
          </button>
        </div>

        <ProjectForm
          newProjectData={newProjectData}
          onChange={handleNewProjectChange}
          onFileChange={handleFileChange}
          selectedFiles={selectedFiles}
          onSubmit={handleUpdateProject}
          loading={loading}
          submitLabel="Guardar Cambios"
        />
      </section>
    );
  };

  const renderAuditoriaTab = () => {
    if (auditLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      );
    }

    if (!auditLog || auditLog.length === 0) {
      return (
        <div className="p-8 bg-white rounded-xl shadow-xl text-center">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            No hay registros de auditoría disponibles.
          </h2>
        </div>
      );
    }

    return (
      <section className="bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-3xl font-bold text-gray-700 flex items-center">
            <FaHistory className="mr-3 text-indigo-600" />
            Registro de Actividad
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setAuditLog([]);
              fetchAuditLog();
            }}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-red-700"
          >
            <FaSyncAlt className="mr-2" /> Recargar
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLog.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.fecha).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.usuarioId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.accion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.entidad} #{log.entidadId}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                    title={log.detalles || ""}
                  >
                    {log.detalles || "Sin detalles"}
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

  const pendingQuotesCount = quotations.filter(
    (q) => q.estado === "PENDIENTE"
  ).length;

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
        <TabButton
          name="quotes"
          label={`Cotizaciones (${pendingQuotesCount})`}
          icon={FaUsers}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          name="projects"
          label={`Portafolio (${projects.length})`}
          icon={FaList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          name="architects"
          label={`Arquitectos (${architects.length})`}
          icon={FaUserTie}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          name="auditoria"
          label="Auditoría"
          icon={FaHistory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Mensajes de feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      )}

      {!loading && error && (
        <div className="p-6 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {activeTab === "quotes" && renderQuotesTab()}
          {activeTab === "projects" && renderProjectsTab()}
          {activeTab === "architects" && renderArchitectsTab()}
          {activeTab === "create_project" && renderCreateProjectTab()}
          {activeTab === "edit_project" && renderEditProjectTab()}
          {activeTab === "auditoria" && renderAuditoriaTab()}
          {activeTab === "new_architect" && renderNewArchitectTab()}
          {activeTab === "edit_architect" && renderEditArchitectTab()}

        </>
      )}
    </motion.div>
  );
};

// -------------------------
// COMPONENTES AUXILIARES
// -------------------------

const TabButton = ({ name, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    className={`flex items-center px-4 py-2 font-semibold transition-colors duration-200 ${
      activeTab === name
        ? "border-b-4 border-indigo-600 text-indigo-600"
        : "text-gray-500 hover:text-indigo-600"
    }`}
    onClick={() => setActiveTab(name)}
  >
    <Icon className="mr-2" />
    {label}
  </button>
);

const ProjectForm = ({
  newProjectData,
  onChange,
  onFileChange,
  selectedFiles,
  onSubmit,
  loading,
  submitLabel,
}) => (
  <div className="p-8 bg-white rounded-xl shadow-xl">
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            value={newProjectData.titulo}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={newProjectData.ubicacion}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Descripción Corta
        </label>
        <input
          type="text"
          name="descripcionCorta"
          value={newProjectData.descripcionCorta}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Descripción Detallada
        </label>
        <textarea
          name="descripcionLarga"
          value={newProjectData.descripcionLarga}
          onChange={onChange}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={newProjectData.fechaInicio}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Fecha de Término Estimada
          </label>
          <input
            type="date"
            name="fechaTermino"
            value={newProjectData.fechaTermino}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Categoría
          </label>
          <input
            type="text"
            name="categoria"
            value={newProjectData.categoria}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Estado
        </label>
        <select
          name="estado"
          value={newProjectData.estado}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="PLANIFICACION">Planificación</option>
          <option value="EN_PROGRESO">En Progreso</option>
          <option value="COMPLETADO">Completado</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Imágenes del Proyecto
        </label>
        <input
          type="file"
          multiple
          onChange={onFileChange}
          className="w-full"
        />
        {selectedFiles.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {selectedFiles.length} archivo(s) seleccionado(s)
          </p>
        )}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        disabled={
          loading || !newProjectData.titulo || !newProjectData.descripcionCorta
        }
        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : (
          <FaPlus className="mr-2" />
        )}
        {loading ? "Procesando..." : submitLabel}
      </motion.button>
    </form>
  </div>
);

export default AdminDashboard;
