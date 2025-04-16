import 'dotenv/config';
import express, { type Application } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import { Pool } from "pg";

// Create an Express application
const app: Application = express();

// Port to listen on
const PORT = process.env.PORT || 8000;

// Test database connection
const testDbConnection = async () => {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const client = await pool.connect();
    console.log("✅ Database connection successful");
    
    // Run a simple query to test the connection
    const result = await client.query('SELECT NOW()');
    console.log(`Database time: ${result.rows[0].now}`);
    
    client.release();
    return true;
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for cors
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// User routes
app.use("/api/users", userRouter);

// Auth routes
app.use("/api/auth", authRouter);

// Start the server after testing DB connection
testDbConnection().then(isConnected => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!isConnected) {
      console.warn("⚠️ Server started but database connection failed - some features may not work");
    }
  });
});
