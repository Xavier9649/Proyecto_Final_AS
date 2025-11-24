const nodemailer = require('nodemailer');

// Configuración del transporte SMTP para Gmail
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // smtp.gmail.com
    port: process.env.EMAIL_PORT, // 587
    secure: false, // false para puerto 587 (usa STARTTLS automáticamente)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Envía un correo electrónico
 */
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado correctamente vía Gmail: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error enviando email (Gmail):', error);
        throw error;
    }
};

module.exports = sendEmail;