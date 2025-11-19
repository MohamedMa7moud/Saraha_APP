import { Router } from "express";
import * as AuthService from "./auth.service.js";
import { authentication, tokenTypeEnum } from "../../Middlewares/auth.middleware.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as validators from "./auth.validation.js";
const router = Router();

router.post("/register", validation(validators.register), AuthService.Register);
router.post("/login", validation(validators.login), AuthService.login);
router.patch(
  "/confirmEmail",
  validation(validators.confirmEmail),
  AuthService.confirmEmail
);
router.post("/revokeToken", authentication({tokentype:tokenTypeEnum.ACCESS}), AuthService.logout);
router.post("/refreshToken", authentication({tokentype:tokenTypeEnum.REFRESH}), AuthService.refreshToken);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  AuthService.forgetPassword
);
router.patch(
  "/resetPassword",
  validation(validators.resetPassword),
  AuthService.resetPassword
);
router.post("/social-login" , AuthService.loginWithGoogle)
export default router;
