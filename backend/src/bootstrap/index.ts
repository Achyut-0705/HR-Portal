import { config } from "dotenv";
import Logger from "../middleware/logger";
import { assignEnvironmentVariable } from "../services/helper.service";
import { connectToMongoDB } from "../services/mongodb.service";

config();

const bootstrap = async () => {
  try {
    const uri = assignEnvironmentVariable("MONGODB_URI") || "";
    const dbName = assignEnvironmentVariable("MONGODB_DB_NAME") || "";

    const db = await connectToMongoDB(uri);
    db.connection.useDb(dbName);

    Logger.info("[mongodb] ✅ Connected to MongoDB Atlas");
  } catch (e) {
    Logger.error("MongoDB connection error:", e);
  }
};

export default bootstrap;
