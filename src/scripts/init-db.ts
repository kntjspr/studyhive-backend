import { connectDatabase, initializeDatabase } from "../database";
import logger from "../utils/logger";

/**
 * Initialize the database
 */
const initDb = async (): Promise<void> => {
  try {
    logger.info("Starting database initialization...");
    
    // Connect to the database
    await connectDatabase();
    
    // Initialize the database
    await initializeDatabase();
    
    logger.info("Database initialization completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Database initialization failed:", error);
    process.exit(1);
  }
};

// Run the initialization
initDb(); 