import connectDB from "./DB/connection.js";
import AuthRouter from "./Modules/Auth/auth.controller.js";
import MessageRouter from "./Modules/Message/message.controller.js";
import UserRouter from "./Modules/User/user.controller.js";
import { globalError } from "./Utils/errorHandler.utils.js";
import cors from "cors";
import path from "node:path";
import { attachRouterWithLogger } from "./Utils/Logger/logger.js";
import helmet from "helmet";
import { corsOption } from "./Utils/cors/cors.utils.js";
import { ratelimiter } from "./Utils/RateLimiter/rateLimit.js";
const bootstrap = async (app, express) => {
  app.use(express.json({ limit: "1kb" }));
  app.use(cors(corsOption()));
  app.use(helmet());
  app.use(ratelimiter);
  await connectDB();
  attachRouterWithLogger(app, "/api/v1/auth", AuthRouter, "auth.log");
  attachRouterWithLogger(app, "/api/v1/user", UserRouter, "user.log");
  attachRouterWithLogger(app, "/api/v1/message", MessageRouter, "message.log");

  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  app.use("/api/v1/auth", AuthRouter);

  app.use("/api/v1/message", MessageRouter);

  app.use("/api/v1/user", UserRouter);

  app.all("", (req, res, next) => {
    return next(new Error("Page Not Found", { cause: 404 }));
  });

  app.use(globalError);
};

export default bootstrap;
