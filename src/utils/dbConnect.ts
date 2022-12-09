import mongoose from "mongoose";
import config from "config";

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    const { username, password, dbUri } = config.get<{
      username: string;
      password: string;
      dbUri: string;
    }>("db");
    await mongoose.connect(`mongodb+srv://${username}:${password}@${dbUri}`);
    console.log("MongoDB connection established successfully");
  } catch (e: any) {
    console.log(e);
    process.exit(1);
  }
};

export { establishDatabaseConnection };
