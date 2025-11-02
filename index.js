import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/Config/.env.dev" });
const app = express();
const port = process.env.PORT || 5000;

await bootstrap(app, express);

app.listen(port, () => {
  console.log(`Server is Running on Port:${port}`);
});
