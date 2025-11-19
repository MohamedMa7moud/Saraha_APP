import * as DBService from "../DB/DBService.js";
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";
import { getSignature, verifyToken } from "../Utils/Tokens/token.utils.js";

export const tokenTypeEnum = { ACCESS: "ACCESS", REFRESH: "REFRESH" };

const decodedToken = async ({
  authorization = {},
  tokentype = tokenTypeEnum.ACCESS,
  next,
} = {}) => {
  const [Bearer, token] = authorization.split(" ") || [];
  if (!Bearer || !token)
    return next(new Error("Invalid Token!", { cause: 400 }));

  let signatures = await getSignature({ signatureLevel: Bearer });
  const decoded = verifyToken({
    token,
    secretKey:
      tokentype === tokenTypeEnum.ACCESS
        ? signatures.accessSignature
        : signatures.refreshSignature,
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
  
  
  return { user, decoded };
};

export const authentication = ({ tokentype = tokenTypeEnum.ACCESS } = {}) => {
  return async (req, res, next) => {
    const { user, decoded } =
      (await decodedToken({
        authorization: req.headers.authorization,
        tokentype,
        next,
      })) || {};
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRoles = [] } = {}) => {
  return (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Unauthorized Access !", { cause: 401 }));
    }
    return next();
  };
};
