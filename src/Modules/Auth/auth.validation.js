import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { roleEnum } from "../../DB/Models/user.model.js";
export const login = {
  body: joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};
export const register = {
  body: joi
    .object({
      firstName: generalFields.firstName.required(),
      middleName: generalFields.middleName.required(),
      lastName: generalFields.lastName.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
      gender: generalFields.gender.required(),
      phone: generalFields.phone.required(),
      role:joi.string().valid('USER' , 'ADMIN').default(roleEnum.USER)
    })
    .options({ allowUnknown: false }),
};

export const confirmEmail = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }),
};

export const forgetPassword = {
  body: joi.object({
    email: generalFields.email.required(),
  }),
};

export const resetPassword = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
  }),
};
