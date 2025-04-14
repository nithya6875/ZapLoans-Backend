import express, { type Application } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";

// Create an Express application
const app: Application = express();

// Port to listen on
const PORT = process.env.PORT || 8000;

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

// User routes
app.use("/api/users", userRouter);

// Listen on port 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
