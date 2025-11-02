import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const sendMessageSchema = {
  body: joi.object({
    content: joi.string().min(5).max(300).required(),
  }),
  params:joi.object( {
    recevierId: generalFields.id.required(),
  }),
};
