import UserModel, { providerEnum } from "../../DB/Models/user.model.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
import * as DBService from "../../DB/DBService.js";
import { asymmetricencrypt } from "../../Utils/Encryption/encryption.utils.js";
import { compare } from "../../Utils/Hashing/hashing.utils.js";
import { hash } from "../../Utils/Hashing/hashing.utils.js";
import { Emitter } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { getNewLoginCredientials } from "../../Utils/Tokens/token.utils.js";
import TokenModel from "../../DB/Models/token.model.js";
import { OAuth2Client } from "google-auth-library";
export const Register = async (req, res, next) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    gender,
    phone,
    role,
  } = req.body;

  const checkUser = await DBService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (checkUser) {
    return next(new Error("Email Already exists!", { cause: 409 }));
  }

  const otp = customAlphabet("293714938nodejs8281769", 6)();

  const newUser = await DBService.create({
    model: UserModel,
    data: [
      {
        firstName,
        middleName,
        lastName,
        email,
        password: await hash({ plainText: password }),
        gender,
        phone: asymmetricencrypt(phone),
        role,
        confirmEmailOtp: await hash({ plainText: otp }),
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    ],
  });

  Emitter.emit("confirmEmail", { to: email, otp, firstName });
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Account has been Created Successfully",
    data: { newUser },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const userData = await DBService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (!userData) {
    return next(new Error("User Not Found!", { cause: 404 }));
  }

  if (!(await compare({ plainText: password, hash: userData.password })))
    return next(new Error(" Wrong Email or Password", { cause: 400 }));
  if (!userData.confirmEmail)
    return next(new Error("Confirm Your Email", { cause: 400 }));

  const generateOTP = customAlphabet("2543IFH839RFG%$H@DSAE58", 6)();
  const otpHash = await hash({ plainText: generateOTP });
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await DBService.updateOne({
    model: UserModel,
    filter: { _id: userData._id },
    data: {
      verify2FAOTP: otpHash,
      OTP2FAExpires: otpExpires,
    },
  });

  Emitter.emit("two-step-verify", {
    to: email,
    otp: generateOTP,
    name: userData.firstName,
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Please Verify 2FA OTP ,Check our email",
  });
};

export const Confirm2FA = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBService.findOne({ model: UserModel, filter: { email } });
  if (!user) return next(new Error("User Not Found!", { cause: 404 }));
  if (!user.verify2FAOTP)
    return next(new Error("NO 2FA Found", { cause: 400 }));
  if (user.OTP2FAExpires < Date.now())
    return next(new Error("OTP Expired", { cause: 400 }));
  const match = await compare({ plainText: otp, hash: user.verify2FAOTP });
  if (!match) return next(new Error("Invalid OTP", { cause: 400 }));

  const creidentials = await getNewLoginCredientials(user);
  await DBService.updateOne({
    model: UserModel,
    filter: { _id: user._id },
    data: { $unset: { verify2FAOTP: true, OTP2FAExpires: true } },
  });
  return SuccessResponse({res,
    statusCode:200,
    message:"Logged In Successfully",
    data:{creidentials}
  })
};

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const checkUser = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      confirmEmailOtp: { $exists: true },
    },
  });
  if (!checkUser)
    return next(
      new Error("User not Found || Email Already Confirmed", { cause: 404 })
    );
  if (checkUser.otpExpiresAt < Date.now())
    return next(new Error("OTP Expired", { cause: 400 }));
  if (!(await compare({ plainText: otp, hash: checkUser.confirmEmailOtp })))
    return next(new Error("invalid OTP", { cause: 400 }));

  await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      $set: {
        confirmEmail: new Date(),
      },
      $unset: { confirmEmailOtp: true, otpExpiresAt: true },
      $inc: { __v: 1 },
    },
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Email has been Confirmed Successfully",
  });
};

export const logout = async (req, res, next) => {
  await DBService.create({
    model: TokenModel,
    data: [
      {
        jwtid: req.decoded.jti,
        expiresIn: new Date(req.decoded.exp * 1000),
        userId: req.user._id,
      },
    ],
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Logged Out has been Successfully",
  });
};

export const refreshToken = async (req, res, next) => {
  const user = req.user;
  const creidentials = await getNewLoginCredientials(user);

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Token has been Refreshed Successfully",
    data: { creidentials },
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const otp = await customAlphabet("158136725alo", 6)();
  const hashOTP = await hash({ plainText: otp });

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: true } },
    data: {
      forgetPasswordOTP: hashOTP,
      forgetPasswordOTPExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  if (!user) return next(new Error("User Not Found", { cause: 404 }));

  Emitter.emit("forgetPassword", {
    to: email,
    firstName: user.firstName,
    otp,
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Check our Email",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: true } },
  });
  if (!user) return next(new Error("User Not Found", { cause: 404 }));
  if (user.forgetPasswordOTPExpiresAt < Date.now())
    return next(new Error("OTP Expired", { cause: 400 }));
  if (!(await compare({ plainText: otp, hash: user.forgetPasswordOTP })))
    return next(new Error("OTP is Wrong", { cause: 400 }));
  await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      password: await hash({ plainText: password }),
      $unset: { forgetPasswordOTP: true },
      $inc: { __v: 1 },
    },
  });
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Password has been Reset Sucessfully",
  });
};

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const loginWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogleAccount({ idToken });
  if (!email_verified)
    return next(new Error("Email Not Verified", { cause: 401 }));
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, freezedAt: { $exists: false } },
  });
  if (user) {
    if (user.provider === providerEnum.GOOGLE) {
      const creidentials = await getNewLoginCredientials(user);

      return SuccessResponse({
        res,
        statusCode: 200,
        message: "Successfully LoggedIn , Welcome Back",
        data: { creidentials },
      });
    }
  }
  const newUser = await DBService.create({
    model: UserModel,
    data: [
      {
        firstName: given_name,
        lastName: family_name,
        email,
        confirmEmail: Date.now(),
        provider: providerEnum.GOOGLE,
      },
    ],
  });
  const creidentials = await getNewLoginCredientials(newUser);
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Logged in Gmail Account Sucessfully",
    data: { creidentials },
  });
};
