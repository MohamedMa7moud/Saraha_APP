import { EventEmitter } from "events";
import { emailSubject, sendEmail } from "../Email/email.utils.js";
import { template } from "../Email/html.code.js";
export const Emitter = new EventEmitter();

Emitter.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.confirmEmail,
    html: template(data.otp , data.firstName,emailSubject.confirmEmail),
  }).catch((err) => {
    console.log(`error to Sending ConfirmEmail!! ${err}`);
  });
});


Emitter.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.resetPassword,
    html: template(data.otp , data.firstName,emailSubject.resetPassword ),
  }).catch((err) => {
    console.log(`error to Sending forgetPassword!! ${err}`);
  });
});

Emitter.on("two-step-verify", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.twoStep,
    html: template(data.otp , data.firstName,emailSubject.twoStep ),
  }).catch((err) => {
    console.log(`error to Sending Two-step verify!! ${err}`);
  });
});