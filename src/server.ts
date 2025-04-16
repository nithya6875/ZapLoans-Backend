// User Controllers By SOURAV BHOWAL
import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import walletRouter from "./routes/wallet.route";

// Create an Express application
const app: Application = express();

// Port to listen on
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" })); // Increase the limit to 50mb if needed

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
app.use("/api/user", userRouter);

// Auth routes
app.use("/api/wallet", walletRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
