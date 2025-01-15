import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticsMw = (app) => {
  app.use(
    "/Assets",
    express.static(path.join(__dirname, "../../Views/Assets"))
  );
};

export default staticsMw;
