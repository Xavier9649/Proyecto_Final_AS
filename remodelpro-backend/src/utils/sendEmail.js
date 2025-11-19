export const sendEmail = async (to, subject, message) => {
    console.log("📧 Simulando envío de email...");
    console.log("Para:", to);
    console.log("Asunto:", subject);
    console.log("Mensaje:", message);

    return { mensaje: "Email simulado (mock)" };
};
