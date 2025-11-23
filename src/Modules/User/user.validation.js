import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import {
  allowedType,
  fileValidation,
} from "../../Utils/multer/local.multer.js";

export const profileImageSchema = {
  file: Joi.object({
    fieldname: generalFields.file.fieldname.valid("profileImage").required(),
    originalname: generalFields.file.originalname.required(),
    encoding: generalFields.file.encoding.required(),
    mimetype: generalFields.file.mimetype
      .valid(...allowedType.images)
      .required(),
    size: generalFields.file.size.max(5 * 1024 * 1024).required(),
    destination: generalFields.file.destination.required(),
    filename: generalFields.file.filename.required(),
    path: generalFields.file.path.required(),
    finalPath: generalFields.file.finalPath.required(),
  }).required(),
};

export const coverImagesSchema = {
  file: Joi.object({
    fieldname: generalFields.file.fieldname.valid("coverImages").required(),
    originalname: generalFields.file.originalname.required(),
    encoding: generalFields.file.encoding.required(),
    mimetype: generalFields.file.mimetype
      .valid(...allowedType.images)
      .required(),
    size: generalFields.file.size.max(5 * 1024 * 1024).required(),
    destination: generalFields.file.destination.required(),
    filename: generalFields.file.filename.required(),
    path: generalFields.file.path.required(),
    finalPath: generalFields.file.path.required(),
  }).required(),
};

export const freezeAccountSchema = {
  params: Joi.object({
    userId: generalFields.id,
  }),
};

export const restoreAccountSchema = {
  params: Joi.object({
    userId: generalFields.id,
  }),
};
export const deleteAccountSchema = {
  params: Joi.object({
    userId: generalFields.id,
  }),
};
