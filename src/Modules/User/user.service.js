import * as DBService from "../../DB/DBService.js";
import UserModel from "../../DB/Models/user.model.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
import { hash, compare } from "../../Utils/Hashing/hashing.utils.js";
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.config.js";
export const getAllUsers = async (req, res, next) => {
  let users = await DBService.find({
    model: UserModel,
    populate: [{ path: "messages", select: "content -_id -receiverId" }],
  });

  // if (users.length === 0) {
  //   return next(
  //     new Error("Sorry Cann't Found Any users in this Database!!", {
  //       cause: 404,
  //     })
  //   );

  // users = users.map((user) => {
  //   return { ...user._doc, phone: asymmetricdecrypt(user.phone) };
  // });
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
