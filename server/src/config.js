const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const required = ["MONGO_URI", "JWT_SECRET", "AI_SERVICE_URL", "AI_SERVICE_KEY"];
if (process.env.NODE_ENV === "production") {
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_screening",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  aiUrl: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",
  aiKey: process.env.AI_SERVICE_KEY || "development-service-key",
  maxFileMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
};

