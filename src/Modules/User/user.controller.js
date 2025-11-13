import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
import {
  allowedType,
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { profileImageSchema , coverImagesSchema } from "./user.validation.js";
import {cloudFileUpload} from "../../Utils/multer/cloud.multer.js"
const router = Router();
router.get("/users", userService.getAllUsers);
router.patch("/update", authentication, userService.updateProfile);
router.patch("/changePassword", authentication, userService.changePassword);
router.patch(
  "/profile-image",
  authentication,
  // localFileUpload({
  //   customPath: "User",
  //   validation: [...allowedType.images],
  // }).single("profileImage"),
  // validation(profileImageSchema),
  // fileValidation,
  cloudFileUpload({validation:[...allowedType.images]}).single("profileImage"),
  userService.profileImage
);
router.patch(
  "/cover-images",
  authentication,
  // localFileUpload({
  //   customPath: "User",
  //   validation: allowedType.images,
  // }).array("coverImages",3),
  // validation(coverImagesSchema),
  // fileValidation,
   cloudFileUpload({validation:[...allowedType.images]}).array("coverImages",3),
  userService.coverImages
);
export default router;
