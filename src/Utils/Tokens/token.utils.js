import jwt from "jsonwebtoken";
import { roleEnum } from "../../DB/Models/user.model.js";
import { v4 as uuid } from "uuid";
export const signatureEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const generateToken = ({
  payload,
  secretKey = process.env.ACCESS_TOKEN_SECRET,
  options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  },
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({
  token,
  secretKey = process.env.ACCESS_TOKEN_SECRET,
}) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = async ({ signatureLevel = signatureEnum.USER }) => {
  let signatures = { accessSignature: undefined, refreshSignature: undefined };

  switch (signatureLevel) {
    case signatureEnum.ADMIN:
      signatures.accessSignature = process.env.ACCESS_ADMIN_TOKEN_SECRET;
      signatures.refreshSignature = process.env.REFRESH_ADMIN_TOKEN_SECRET;

      break;

    default:
      signatures.accessSignature = process.env.ACCESS_USER_TOKEN_SECRET;
      signatures.refreshSignature = process.env.REFRESH_USER_TOKEN_SECRET;
      break;
  }
  return signatures;
};

export const getNewLoginCredientials = async (user) => {
  const signatures = await getSignature({
    signatureLevel:
      user.role != roleEnum.USER ? signatureEnum.ADMIN : signatureEnum.USER,
  });
  const jwtid = uuid();
  const accessToken = await generateToken({
    payload: { id: user._id, email: user.email },
    secretKey: signatures.accessSignature,
    options: {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_IN),
      jwtid,
    },
  });

  const refreshToken = await generateToken({
    payload: { id: user._id, email: user.email },
    secretKey: signatures.refreshSignature,
    options: {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN),
      jwtid,
    },
  });
  return { accessToken, refreshToken };
};
