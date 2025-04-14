import express, { type Application } from "express";
import cors from "cors";

// Create an Express application
const app: Application = express();

// Port to listen on
const PORT = 8000 || process.env.PORT;

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

// Get route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Listen on port 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
