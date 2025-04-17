import { Resend } from "resend";
import { join } from "path";
import dotenv from "dotenv";

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, "../../.env") });

// Resend API key
const resendApiKey = process.env.RESEND_API_KEY;

// If the API key is not defined, log an error and exit
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

// Initialize Resend Client
export const resend = new Resend(resendApiKey);
