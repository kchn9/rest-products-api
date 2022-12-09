import express from "express";
import config from "config";
import { establishDatabaseConnection } from "./utils/dbConnect";

const app = express();
const { port } = config.get<{ port: number }>("server");

app.listen(port, async () => {
  await establishDatabaseConnection();
});
