import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration object
 * Contains all environment variables used in the application
 */
const environment = {
  // Server configuration
  port: process.env.PORT || "3000",
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_KEY || "",
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "default_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
    authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "60000", 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
  },
};

export default environment; 