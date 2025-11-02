import joi from "joi";
import { genderEnum } from "../DB/Models/user.model.js";

export const validation = (schema) => {
  return  (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        validationError.push({ key, details: validationResult.error.details });
      }
    }

    if (validationError.length) {
      return res.status(400).json({message:"Validation Error" , details:validationError})
    }
    return next();
  };
};

export const generalFields = {
  firstName: joi.string().min(4).max(10).alphanum().messages({
    "string.min": "FirstName Length min is 4 Characters Required!",
    "string.max": "FirstName Length max is 10 Characters Required!",
    "string.alphanum": "FirstName required a-z,A-Z,0-9!",
    "string.empty": "FirstName is Required!",
    "any.required": "FirstName is Required!",
  }),
  middleName: joi.string().min(4).max(10).alphanum().messages({
    "string.min": "MiddleName Length min is 4 Characters Required!",
    "string.max": "MiddleName Length max is 10 Characters Required!",
    "string.alphanum": "MiddleName required a-z,A-Z,0-9!",
    "string.empty": "MiddleName is Required!",
    "any.required": "MiddleName is Required!",
  }),
  lastName: joi.string().min(4).max(10).alphanum().messages({
    "string.min": "LastName Length min is 4 Characters Required!",
    "string.max": "LastName Length max is 10 Characters Required!",
    "string.alphanum": "LastName required a-z,A-Z,0-9!",
    "string.empty": "LastName is Required!",
    "any.required": "LastName is Required!",
  }),
  confirmPassword: joi.string().valid(joi.ref("password")).messages({
    "any.only": "Password must be Matched",
  }),
  gender: joi
    .string()
    .valid(...Object.values(genderEnum))
    .required(),
  phone: joi
    .string()
    .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))

    .messages({
      "string.pattern.base": "Phone is Required Match Egypt Numbers !",
    }),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "edu", "org"] },
    })

    .messages({
      "string.email":
        "Email must be a valid Like 'example@gmail.com,(net,edu,org)'",
    }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages({
      "string.pattern.base": "Password must be Strong Like a-zA-Z,@#$%,Numbers",
    }),
  otp: joi.string(),
  id: joi.string().custom((value, helper) => {
    return (
      Types.ObjectId.isValid(value) || helper.message("invalid ObjectId Format")
    );
  }),
};
