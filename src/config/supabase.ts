import { createClient } from "@supabase/supabase-js";
import environment from "./environment";

/**
 * Supabase client instance
 * Used for database operations and authentication
 */
const supabaseUrl = environment.supabase.url;
const supabaseKey = environment.supabase.key;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key must be provided in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 