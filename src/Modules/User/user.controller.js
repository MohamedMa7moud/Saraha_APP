import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import {
  allowedType,
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import {
  profileImageSchema,
  coverImagesSchema,
  freezeAccountSchema,
  restoreAccountSchema,
  deleteAccountSchema,
} from "./user.validation.js";
import { cloudFileUpload } from "../../Utils/multer/cloud.multer.js";
import { roleEnum } from "../../DB/Models/user.model.js";
const router = Router();
router.get("/users", userService.getAllUsers);
router.patch(
  "/update",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  userService.updateProfile
);
router.patch("/changePassword", authentication, userService.changePassword);
router.patch(
  "/profile-image",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.USER] }),
  // localFileUpload({
  //   customPath: "User",
  //   validation: [...allowedType.images],
  // }).single("profileImage"),
  // validation(profileImageSchema),
  // fileValidation,
  cloudFileUpload({ validation: [...allowedType.images] }).single(
    "profileImage"
  ),
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
  cloudFileUpload({ validation: [...allowedType.images] }).array(
    "coverImages",
    3
  ),
  userService.coverImages
);

router.delete(
  "{/:userId}/freeze-account",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(freezeAccountSchema),
  userService.freezeAccount
);

router.patch(
  "{/:userId}/restore-account",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(restoreAccountSchema),
  userService.restoreAccount
);

router.delete(
  "{/:userId}/delete-account",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  validation(deleteAccountSchema),
  userService.deleteAccount
);
export default router;
