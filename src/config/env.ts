interface EnvConfig {
  port: number;
  dbUri: string;
  jwtSecret: string;
}

const config: EnvConfig = {
  port: parseInt(process.env.PORT || "3000"),
  dbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

// Validar que existan
if (!config.dbUri || !config.jwtSecret) {
  //throw new Error("Missing required environment variables");
}

export default config;
