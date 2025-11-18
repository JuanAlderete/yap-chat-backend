import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  port: number;
  dbUri: string;
  jwtSecret: string;
  jwtExpire: string;
  emailHost: string;
  emailUser: string;
  emailPass: string;
  frontendUrl: string;
  backendUrl: string;
}

const config: EnvConfig = {
  port: parseInt(process.env.PORT || "3000"),
  dbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  emailHost: process.env.EMAIL_HOST || "",
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
  frontendUrl: process.env.FRONTEND_URL || "",
  backendUrl: process.env.BACKEND_URL || "",
};

// Validar que existan
if (!config.dbUri || !config.jwtSecret) {
  throw new Error("Missing required environment variables");
}

export default config;
