import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, resetUrl } = datos;

    // Crear la URL de restablecimiento
    //const resetUrl = `http://${process.env.HOST}/reestablecer-password/${token}`;

    // Enviar el correo
    await transport.sendMail({
        from: '"DevJobs" <no-reply@devjobs.com>',
        to: email,
        subject: 'Restablecer tu contraseña',
        text: `Hola ${nombre}, has solicitado restablecer tu contraseña. Puedes hacerlo mediante el siguiente enlace: ${resetUrl}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #000;">
            <p>Hola <span style="color: #20B2AA;">${nombre}</span>,</p>
            <p>Has solicitado restablecer tu contraseña. Puedes hacerlo mediante el siguiente enlace:</p>
            <a href="${resetUrl}" style="color: #20B2AA; text-decoration: none; font-weight: bold;">Restablecer contraseña</a>
            <p>Si tú no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
        `
    });
};

export default emailOlvidePassword;
