import mongoose, { Schema } from "mongoose";
import { ref } from "node:process";

export const genderEnum = {
  Male: "Male",
  Female: "Female",
};
export const providerEnum = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
};

export const roleEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.provider === providerEnum.SYSTEM;
      },
      trim: true,
      minLength: [
        4,
        "First Name Must be at least 4 Characters Long Required! ",
      ],
      maxLength: [
        12,
        "First Name Must be at most 20 Characters Long Required! ",
      ],
    },
    middleName: {
      type: String,
      required: function () {
        return this.provider === providerEnum.SYSTEM;
      },
      trim: true,
      minLength: [4, "last Name Must be at least 4 Characters Long Required! "],
      maxLength: [
        20,
        "last Name Must be at most 12 Characters Long Required! ",
      ],
    },
    lastName: {
      type: String,
      required: function () {
        return this.provider === providerEnum.SYSTEM;
      },
      trim: true,
      minLength: [4, "last Name Must be at least 4 Characters Long Required! "],
      maxLength: [
        20,
        "last Name Must be at most 12 Characters Long Required! ",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providerEnum.SYSTEM;
      },
      minLength: [6, "Password must be least 6 characters Required!"],
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: Object.values(genderEnum),
        message: "{VALUES} is not valid Gender",
      },
      default: genderEnum.Male,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
      },
      default: roleEnum.USER,
    },
    provider: {
      type: String,
      required: true,
      enum: {
        values: Object.values(providerEnum),
        message: "{VALUES} is not valid Gender",
      },
      default: providerEnum.SYSTEM,
    },

    phone: {
      type: String,
      required: function () {
        return this.provider === providerEnum.SYSTEM;
      },
    },
    profileImage: String,
    coverImages: [String],
    cloudProfileImage: { public_id: String, secure_url: String },
    cloudCoverImages: [{ public_id: String, secure_url: String }],
    freezedAt: Date,
    freezedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    confirmEmail: {
      type: Date,
    },
    confirmEmailOtp: { type: String },
    activateOtpExpiresAt: { type: Date },
    otpExpiresAt: { type: Date },
    forgetPasswordOTP: { type: String },
    forgetPasswordOTPExpiresAt: { type: Date },
    verify2FAOTP:{type:String},
    OTP2FAExpires: { type: Date },

  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual("messages", {
  localField: "_id",
  foreignField: "receiverId",
  ref: "Message",
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
