import { Router } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
const router = Router();
router.post("/sendmessage/:receiverId",validation(sendMessageSchema), messageService.sendMessage);
router.get("/getmessages", messageService.getMessage);
export default router;
