import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { supabase } from "./config/supabase";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    // Check Supabase connection
    const { data, error } = await supabase.from("profiles").select("count").limit(0);
    
    const healthStatus = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        api: {
          status: "ok",
          port: port
        },
        database: {
          status: error ? "error" : "ok",
          type: "supabase",
          error: error?.message
        }
      },
      version: "1.0.0"
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 