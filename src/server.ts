import app from "./app";
import config from "./config";
import logger from "./utils/logger";
import { connectDatabase } from "./database";

/**
 * Start Express server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info("Database connection established");

    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
      logger.info(
        `API Documentation available at http://localhost:${config.port}/api-docs`
      );
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (err: Error) => {
      logger.error("UNHANDLED REJECTION! Shutting down...");
      logger.error(err.name, err.message);
      
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM signal
    process.on("SIGTERM", () => {
      logger.info("SIGTERM RECEIVED. Shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated!");
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer(); 