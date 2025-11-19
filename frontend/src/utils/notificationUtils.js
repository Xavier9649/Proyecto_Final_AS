/**
 * Utilidad para simular/manejar notificaciones en el Frontend.
 * En una app real, esto podría conectar con WebSockets o simplemente
 * mostrar Toasts (alertas flotantes).
 */

const notificationUtils = {
    triggerQuotationConfirmationEmail: async ({ email, nombre, cotizacionId, action }) => {
        // Simplemente logueamos para desarrollo.
        // La lógica real de envío de email ocurre en el Backend al recibir la petición.
        console.log(`[FRONTEND NOTIFICATION]: Simulando envío de email a ${email} (${nombre})`);
        console.log(`[ACTION]: ${action || 'CREACION_COTIZACION'} - ID: ${cotizacionId}`);
        
        return true;
    }
};

export default notificationUtils;