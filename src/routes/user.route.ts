// User Controllers By SOURAV BHOWAL
import { Router } from "express";
import {
  signUpUser,
  signInUser,
  getCurrentUser,
  verifyOTP,
  resendOTP,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Create a new router instance for user-related routes
const userRouter = Router();

// Route to sign up a new user
userRouter.route("/signup").post(signUpUser);

// Route to verify the user's email
userRouter.route("/verify").post(verifyOTP);

// Route to resend the OTP email
userRouter.route("/resend-otp").post(resendOTP);

// Route to sign in an existing user
userRouter.route("/signin").post(signInUser);

// Route to get the current user
userRouter.route("/get-user").get(authMiddleware, getCurrentUser);

// Export the user router
export default userRouter;
