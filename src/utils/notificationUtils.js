// src/utils/notificationUtils.js

const notificationUtils = {
    /**
     * Simula el trigger de notificación al cliente (ejecutado en el Backend).
     * @param {object} userData - Datos del usuario o cotización para el cuerpo del email.
     */
    triggerQuotationConfirmationEmail: async (userData) => {
        // En este punto, solo hacemos un log, asumiendo que el Backend lo manejará.
        console.log(`[EMAIL TRIGGERED]: Enviando confirmación de cotización a ${userData.email}.`);
        
        // Si el Backend tuviera un endpoint dedicado para forzar el envío de emails (ej. /send-email),
        // harías la llamada aquí. Pero por la arquitectura, confiamos en el POST /quotations.
        
        return { success: true, message: 'La solicitud de email fue iniciada.' };
    }
};

export default notificationUtils;