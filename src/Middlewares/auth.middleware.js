import * as DBService from "../DB/DBService.js";
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";
import { verifyToken } from "../Utils/Tokens/token.utils.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return next(new Error("Authorization Token Not Found", { cause: 400 }));
if(!authorization.startsWith(process.env.TOKEN_PREFIX))
    return next (new Error ("invalid authorization Format !!" , {cause:400}))
const token = authorization.split(" ")[1];
  const decoded = verifyToken({
    token,
    secretKey: process.env.ACCESS_TOKEN_SECRET,
  });
  if (!decoded.jti) return next(new Error("invalid Token", { cause: 400 }));
  const revokedToken = await DBService.findOne({
    model: TokenModel,
    filter: { jwtid: decoded.jti },
  });
  if (revokedToken) return next(new Error("Token is Revoked", { cause: 401 }));

  const user = await DBService.findById({
    model: UserModel,
    id: decoded.id,
  });
  if (!user) return next(new Error("User Not Found", { cause: 404 }));
  req.user = user;
  req.decoded = decoded;

  next();
};
