import express from "express";
import logger from "morgan";
import cors from "./cors.js";

export default () => {
  const app = express();

  // Requests logger
  app.use(logger("dev"));

  // Allow CORS
  app.use(cors);

  // middleware parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Removes server info
  app.disable("x-powered-by");

  return app;
};
