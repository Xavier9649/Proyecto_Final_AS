// src/pages/CotizarProyecto.jsx

import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import api from "../services/api";

const CotizarProyecto = () => {
  const { id } = useParams(); // ID del proyecto
  const { user } = useAuth(); // Usuario logueado

  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------------------------
  // 🔒 Si NO hay usuario → redirigir al login
  // -------------------------------------------
  if (!user) {
    return <Navigate to={`/login?redirect=/cotizar/${id}`} />;
  }

  // -------------------------------------------
  // 📩 Enviar solicitud de cotización al backend
  // -------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/quotations", {
        proyectoId: Number(id),
        mensaje: descripcion  // descripción del cliente
        });

      setEnviado(true);
      setError(null);

    } catch (err) {
      console.error(err);
      setError("Hubo un problema al enviar la cotización.");
    }
  };

  // -------------------------------------------
  // 🎉 Vista después del envío exitoso
  // -------------------------------------------
  if (enviado) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold text-indigo-600">
          ¡Solicitud enviada!
        </h2>

        <p className="mt-4 text-gray-600">
          Hemos recibido tu solicitud y un asesor se pondrá en contacto contigo.
        </p>

        <Link 
          to="/portfolio"
          className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow"
        >
          Volver al Portafolio
        </Link>
      </div>
    );
  }

  // -------------------------------------------
  // 📝 Formulario principal
  // -------------------------------------------
  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Solicitar Cotización
      </h1>

      <p className="text-gray-600 mb-6">
        Completa el siguiente formulario para solicitar una cotización del proyecto.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nombre */}
        <div>
          <label className="font-semibold">Nombre completo</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
            value={user.name}
            disabled
          />
        </div>

        {/* Correo */}
        <div>
          <label className="font-semibold">Correo electrónico</label>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
            value={user.email}
            disabled
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="font-semibold">Teléfono (opcional)</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-lg"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="font-semibold">Descripción de lo que necesitas</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-lg h-32"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow"
        >
          Enviar Cotización
        </button>
      </form>

      {/* Botón volver */}
      <Link 
        to={`/portfolio/${id}`}
        className="block text-center mt-6 text-indigo-600 hover:text-indigo-800"
      >
        ← Volver al Proyecto
      </Link>

    </div>
  );
};

export default CotizarProyecto;

