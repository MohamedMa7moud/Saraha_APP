import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "",
  text = "",
  html = "",
  attachments = "",
  cc = "",
  bcc = "",
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Route Team ❤️" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
    attachments,
    cc,
    bcc,
  });

  console.log("Message sent:", info.messageId);
}

export const emailSubject = {
  confirmEmail: "Please Confirm Your Email",
  resetPassword: "Reset Your Password",
  welcome: "Welcome in Route Academy ❤️",
};
