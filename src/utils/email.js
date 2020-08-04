import nodemailer, { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// export const getPasswordResetURL = (user, token) =>
//   `http://localhost:3000/password/reset/${user._id}/${token}`;

export const resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_USER;
  const to = user.email;
  const subject = "PCUS - Reestablecer contraseña";
  const html = `
  <p>Hola ${user.name} ${user.lastname},</p>
  <p>Se ha solicitado un reinicio de contraseña del sistema de gestion de PCUS 
  de la secretaría de ambiente de la provincia de Salta.</p>
  <p>Para reinciar su contraseña, por favor haga click en el siguiente link:</p>
  <a href=${url}>${url}</a>
  <p>Si no usa el link en una hora este expirará.</p>
  <p>–Secretaría de ambiente de la provincia de salta</p>
  `;

  return { from, to, subject, html };
};

export const newReviewNotificationTemplate = ({ user, procedure, message }) => {
  const from = "Secretaria de ambiente";
  const to = user.email;
  const subject =
    "Notificacion sobre su procedimiento de cambio de uso de suelo";
  const html = `
  <p>Hola ${user.name} ${user.lastname},</p>
  <p>Se ha realizado una actualizacion sobre su plan de cambio de uso de suelo nro ${procedure.id}.</p>
  <p>${message}</p>
  <p>Para mas detalle dirijase al sistema de plan de cambio de uso de suelo e inicie sesion.</p>
  <p>–Secretaría de ambiente de la provincia de salta</p>
  `;
  return { from, to, subject, html };
};

export const userUpdateProcedureNotificationTemplate = ({
  user,
  procedure,
}) => {
  const from = "Secretaría de ambiente";
  const to = user.email;
  const subject = "Se ha actualizado un procedimiento.";
  const html = `
  <p>Hola ${user.name} ${user.lastname},</p>
  <p>El procedimiento nro. ${procedure.id} ha sido actualizado por el proponente.</p>
  <p>Por favor ingrese al sistema y realice la revision pertinente.</p>
  <a href="${process.env.CLIENT_URL}/admin/procedure/${procedure.id}">VER PROCEDIMIENTO</a>
  <p>–Secretaría de ambiente de la provincia de salta</p>
  `;
  return { from, to, subject, html };
};
