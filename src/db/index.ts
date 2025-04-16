import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";
import { join } from "path";

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, "../../.env") });

// Log the connection string (remove sensitive info in production)
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

// Create a connection pool to the PostgreSQL database with error handling
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false // Needed for some hosted PostgreSQL services
  }
});

// Test the database connection before proceeding
console.log("Attempting to connect to database...");
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Export the pool for use in other parts of the application
export const db = drizzle(pool, { schema });
