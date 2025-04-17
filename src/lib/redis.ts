// Redis CLient
import { Redis } from "ioredis";
import { join } from "path";
import dotenv from "dotenv";

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, "../../.env") });

// Redis connection string
const redisUrl = process.env.REDIS_URL;

// If the connection string is not defined, log an error and exit
if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

// Initialize Redis Client
const redis = new Redis(redisUrl);

// Handle Redis connection errors
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Redis Client
export const redisClient = {
  // Get value from Redis by key
  get: async (key: string) => {
    try {
      const value = await redis.get(key);
      return value;
    } catch (error) {
      console.error("Error getting value from Redis:", error);
      throw error;
    }
  },

  // Set value in Redis by key with optional expiration time
  set: async (key: string, value: string, expirationInSeconds?: number) => {
    try {
      if (expirationInSeconds) {
        await redis.set(key, value, "EX", expirationInSeconds);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error("Error setting value in Redis:", error);
      throw error;
    }
  },
};
