import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import config from "./config";

/**
 * Initialize Express application
 */
const app: Express = express();

/**
 * Apply global middlewares
 */
// Security middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Performance middlewares
app.use(compression()); // Compress all responses

// Logging
if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
}

/**
 * Health check endpoint
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

/**
 * API routes
 */
app.use("/api", routes);

/**
 * 404 handler for undefined routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

/**
 * Global error handler
 */
app.use(errorHandler);

export default app; 