import nodemailer from "nodemailer";
import envConfig from "../config/env";

const transporter = nodemailer.createTransport({
  service: envConfig.emailHost,
  auth: {
    user: envConfig.emailUser,
    pass: envConfig.emailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  try {
    await transporter.sendMail({
      from: envConfig.emailUser,
      to: email,
      subject: "Verifica tu cuenta de mail",
      html: `
            <h1>Verifica tu cuenta de mail</h1>
            <a href="${envConfig.backendUrl}/api/auth/verify-email/${token}">Verificar</a>
        `,
    });
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    return;
  }
}
