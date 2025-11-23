import * as DBService from "../../DB/DBService.js";
import UserModel, { roleEnum } from "../../DB/Models/user.model.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
import { hash, compare } from "../../Utils/Hashing/hashing.utils.js";
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.config.js";
export const getAllUsers = async (req, res, next) => {
  let users = await DBService.find({
    model: UserModel,
    populate: [{ path: "messages", select: "content -_id -receiverId" }],
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "users has been fetched Successfully",
    data: { users },
  });
};

export const updateProfile = async (req, res, next) => {
  const { firstName, middleName, LastName } = req.body;
  const user = await DBService.findByIdAndUpdate({
    model: UserModel,
    id: req.user.id,
    data: { firstName, middleName, LastName, $inc: { __v: 1 } },
    options: { new: true },
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User has been Updated Successfully",
    data: { user },
  });
};
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await DBService.findById({
    model: UserModel,
    id: req.decoded.id,
  });
  if (!user) return next(new Error("User not Found", { cause: 404 }));
  const matchedPassword = await compare({
    plainText: oldPassword,
    hash: user.password,
  });

  if (!matchedPassword)
    return next(new Error("Old password is incorrect", { cause: 400 }));
  const hashedPassword = await hash({ plainText: newPassword });
  const changePassword = await DBService.updateOne({
    model: UserModel,
    filter: { _id: req.decoded.id },
    data: { $set: { password: hashedPassword } },
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Password has been changed Sucessfully",
    data: { hashedPassword },
  });
};

export const profileImage = async (req, res, next) => {
  const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `Saraha/Users/${req.user._id}`,
    }
  );

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { cloudProfileImage: { public_id, secure_url } },
  });

  if (req.user.cloudProfileImage?.public_id) {
    await cloudinaryConfig().uploader.destroy(
      req.user.cloudProfileImage.public_id
    );
  }

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "image has been Updated Sucessfully",
    data: { user },
  });
};

export const coverImages = async (req, res, next) => {
  const attachment = [];
  for (const file of req.files) {
    const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder: `Saraha/Users/${req.user._id}`,
      }
    );
    attachment.push({ public_id, secure_url });
  }

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },

    data: { cloudCoverImages: attachment },
  });
  if (req.user.cloudCoverImages?.public_id) {
    await cloudinaryConfig().uploader.destroy(
      req.user.cloudCoverImages.public_id
    );
  }
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "images has been Updated Sucessfully",
    data: { user },
  });
};

export const freezeAccount = async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.ADMIN)
    return next(new Error("u're cann't Freeze Account", { cause: 401 }));

  const updateUser = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      freezedAt: { $exists: false },
    },
    data: { freezedAt: Date.now(), freezedBy: req.user._id },
  });
  if (!updateUser) return next(new Error("In-valid Account"));
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User has been Freezed",
    data: { user: updateUser },
  });
};

export const restoreAccount = async (req, res, next) => {
  const { userId } = req.params;

  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      freezedAt: { $exists: true },
      freezedBy: { $exists: true },
    },
  });

  if (!user) return next(new Error("Account is not found or not frozen"));

  const isFreezed = user.freezedBy === user._id;

  if (isFreezed) {
    if (req.user._id !== user._id) {
      return next(new Error("Only the user can restore the own account"));
    }
  }
  if (req.user.role !== "ADMIN")
    return next(
      new Error(
        "This account was suspended by Admin Only Admins can restore it"
      )
    );

  const restoreUser = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: user._id,
    },
    data: {
      $unset: { freezedAt: true, freezedBy: true },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });
  if (!restoreUser) return next(new Error("In-valid Account"));
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User has been Restored",
    data: { user: restoreUser },
  });
};

export const deleteAccount = async (req, res, next) => {
  const { userId } = req.params;

  const deleteUser = await DBService.findOneAndDelete({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      freezedAt: { $exists: true },
      freezedBy: { $exists: true },
    },
  });
  if (!deleteUser) return next(new Error("In-valid Account"));
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User has been got Hard Deleted ",
  });
};
