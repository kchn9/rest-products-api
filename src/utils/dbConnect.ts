import mongoose from "mongoose";
import config from "config";
import logger from "@/utils/logger";

const establishDatabaseConnection = async (): Promise<void> => {
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
};

export { establishDatabaseConnection };
