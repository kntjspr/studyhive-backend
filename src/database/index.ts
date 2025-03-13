import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "../config";
import logger from "../utils/logger";

/**
 * Supabase client instance
 */
let supabaseClient: SupabaseClient;

/**
 * Initialize and connect to the Supabase database
 * @returns Supabase client instance
 */
export const connectDatabase = async (): Promise<SupabaseClient> => {
  try {
    // Create Supabase client
    supabaseClient = createClient(
      config.supabase.url,
      config.supabase.key
    );

    // Test connection with a simple query
    try {
      await supabaseClient.from('users').select('count').limit(1);
      logger.info("Connected to Supabase successfully");
    } catch (error) {
      logger.warn("Connected to Supabase, but tables may not exist yet");
      
      // Check if required tables exist and create them if they don't
      await initializeDatabase();
    }
    
    return supabaseClient;
  } catch (error) {
    logger.error("Database connection error:", error);
    throw error;
  }
};

/**
 * Initialize the database by creating required tables if they don't exist
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    logger.info("Initializing database tables...");
    
    // We'll use the REST API directly to execute SQL
    const headers = {
      'apikey': config.supabase.key,
      'Authorization': `Bearer ${config.supabase.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    };
    
    // Create extension for UUID generation if it doesn't exist
    try {
      await fetch(`${config.supabase.url}/rest/v1/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        })
      });
      logger.info("UUID extension check completed");
    } catch (error) {
      logger.error("Error creating UUID extension:", error);
    }
    
    // Create users table
    try {
      await fetch(`${config.supabase.url}/rest/v1/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              avatar TEXT,
              role TEXT DEFAULT 'user',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });
      logger.info("Users table created or already exists");
    } catch (error) {
      logger.error("Error creating users table:", error);
    }
    
    // Create tasks table
    try {
      await fetch(`${config.supabase.url}/rest/v1/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS public.tasks (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
              title TEXT NOT NULL,
              description TEXT,
              due_date TIMESTAMP WITH TIME ZONE,
              priority TEXT DEFAULT 'medium',
              status TEXT DEFAULT 'pending',
              category TEXT,
              is_completed BOOLEAN DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });
      logger.info("Tasks table created or already exists");
    } catch (error) {
      logger.error("Error creating tasks table:", error);
    }
    
    // Create events table
    try {
      await fetch(`${config.supabase.url}/rest/v1/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS public.events (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
              title TEXT NOT NULL,
              description TEXT,
              start_time TIMESTAMP WITH TIME ZONE NOT NULL,
              end_time TIMESTAMP WITH TIME ZONE NOT NULL,
              location TEXT,
              color TEXT,
              is_all_day BOOLEAN DEFAULT false,
              reminder TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });
      logger.info("Events table created or already exists");
    } catch (error) {
      logger.error("Error creating events table:", error);
    }
    
    // Create refresh_tokens table
    try {
      await fetch(`${config.supabase.url}/rest/v1/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS public.refresh_tokens (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
              token TEXT NOT NULL,
              expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });
      logger.info("Refresh tokens table created or already exists");
    } catch (error) {
      logger.error("Error creating refresh_tokens table:", error);
    }
    
    logger.info("Database initialization completed");
  } catch (error) {
    logger.error("Error initializing database:", error);
    throw error;
  }
};

/**
 * Get the Supabase client instance
 * @returns Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    throw new Error("Supabase client not initialized. Call connectDatabase() first.");
  }
  return supabaseClient;
};

export default {
  connectDatabase,
  getSupabaseClient,
  initializeDatabase
}; 