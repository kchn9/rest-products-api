import "module-alias/register";
import express from "express";
import config from "config";
import { establishDatabaseConnection } from "./utils/dbConnect";
import logger from "@/utils/logger";

const app = express();
const { port } = config.get<{ port: number }>("server");

app.listen(port, async () => {
    logger.info(`App is running on: http://localhost:${port}`);
    await establishDatabaseConnection();
});
