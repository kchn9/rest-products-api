import Controller from "./interfaces/controller.interface";
import express, { Application } from "express";
import logger from "@/utils/logger";
import config from "config";
import mongoose from "mongoose";
import morgan from "morgan";

class App {
    private app: Application;
    private port: number;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;

        this.establishDatabaseConnection();
        this.initializeMiddleware();
        this.intializeControllers(controllers);
    }

    private initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(morgan("tiny"));
    }

    private async establishDatabaseConnection(): Promise<void> {
        try {
            const { username, password, dbUri } = config.get<{
                username: string;
                password: string;
                dbUri: string;
            }>("db");
            mongoose.set("strictQuery", false);
            await mongoose.connect(
                `mongodb+srv://${username}:${password}@${dbUri}`
            );
            logger.info("MongoDB connection established successfully");
        } catch (e: unknown) {
            logger.fatal(e);
            process.exit(1);
        }
    }

    private intializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) =>
            this.app.use("/api", controller.router)
        );
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`App is running on: http://localhost:${this.port}`);
        });
    }
}

export default App;
