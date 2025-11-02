import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  secretKey = process.env.ACCESS_TOKEN_SECRET,
  options ={
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  },
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};
