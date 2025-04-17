// User Controllers By SOURAV BHOWAL
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { db } from "../db/index.js";
import {
  signInUserSchema,
  signUpUserSchema,
  verifyUserSchema,
} from "../validations/user.validation.js";
import { or, eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import { redisClient } from "../lib/redis.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";

// Sign Up Controller
export const signUpUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    try {
      const { error, success, data } = signUpUserSchema.safeParse(request.body);

      // If validation fails, throw an error and send response
      if (!success) {
        throw new apiError(400, error?.errors[0]?.message);
      }

      // Destructure request body
      const { username, email, password } = data;

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: or(eq(users.username, username), eq(users.email, email)),
      });

      // If user exists, throw an error and send response
      if (existingUser) {
        throw new apiError(400, "User already exists.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const [newUser] = await db
        .insert(users)
        .values({
          username: username.toLowerCase(),
          email,
          password: hashedPassword,
          isVerified: false,
        })
        .returning();

      // If user is not created, throw an error and send response
      if (!newUser) {
        throw new apiError(400, "User could not be created.");
      }

      // Generate OTP
      const otp = generateOTP(6);

      // Store OTP in Redis with 5 minutes expiration
      const otpKey = `otp:${newUser.username}`;

      // Save OTP to Redis
      await redisClient.set(otpKey, otp, 300);

      // Send OTP email
      await sendOTPEmail({
        email: newUser.email,
        username: newUser.username,
        otp,
      });

      // Send response
      response
        .status(201)
        .json(new apiResponse(201, null, "User created successfully."));
    } catch (error) {
      // Handle error
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Internal server error.");
      }
    }
  }
);

// Verify OTP Controller
export const verifyOTP = asyncHandler(
  async (request: Request, response: Response) => {
    try {
      // Validate request body
      const { error, success, data } = verifyUserSchema.safeParse(request.body);

      // If validation fails, throw an error and send response
      if (!success) {
        throw new apiError(400, error?.errors[0]?.message);
      }

      // Destructure request body
      const { username, otp } = data;

      // OTP key for Redis
      const otpKey = `otp:${username}`;

      // Get OTP from Redis
      const storedOtp = await redisClient.get(otpKey);

      // If OTP does not match, throw an error and send response
      if (storedOtp !== otp) {
        throw new apiError(400, "Invalid OTP.");
      }

      // Update user verification status
      const [user] = await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.username, username))
        .returning();

      // Delete OTP from Redis
      await redisClient.del(otpKey);

      // Send welcome email
      await sendWelcomeEmail({
        username: user.username,
        email: user.email,
      });

      // Send response
      response.status(200).json(new apiResponse(200, null, "User verified."));
    } catch (error) {
      // Handle error
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Internal server error.");
      }
    }
  }
);

// Resend OTP Controller
export const resendOTP = asyncHandler(
  async (request: Request, response: Response) => {
    try {
      // Validate request body
      const { error, success, data } = verifyUserSchema.safeParse(request.body);

      // If validation fails, throw an error and send response
      if (!success) {
        throw new apiError(400, error?.errors[0]?.message);
      }

      // Destructure request body
      const { username } = data;

      // Generate new OTP
      const otp = generateOTP(6);

      // Store OTP in Redis with 5 minutes expiration
      const otpKey = `otp:${username}`;

      // Save OTP to Redis
      await redisClient.set(otpKey, otp, 300);

      // Send OTP email
      await sendOTPEmail({
        email: username,
        username,
        otp,
      });

      // Send response
      response.status(200).json(new apiResponse(200, null, "New OTP sent."));
    } catch (error) {
      // Handle error
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Internal server error.");
      }
    }
  }
);

// Sign In Controller
export const signInUser = asyncHandler(
  async (request: Request, response: Response) => {
    try {
      // Destructure request body
      const { error, success, data } = signInUserSchema.safeParse(request.body);

      // If validation fails, throw an error and send response
      if (!success) {
        throw new apiError(400, error?.errors[0]?.message);
      }

      // Destructure request body
      const { email, password } = data;

      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // If user not found, throw an error and send response
      if (!user) {
        throw new apiError(401, "Invalid email or password.");
      }

      // Check if user is verified
      if (!user.isVerified) {
        throw new apiError(401, "User is not verified.");
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If password is invalid, throw an error and send response
      if (!isPasswordValid) {
        throw new apiError(401, "Invalid email or password.");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
          algorithm: "HS256",
        }
      );

      // If token generation fails, throw an error and send response
      if (!token) {
        throw new apiError(500, "Token generation failed.");
      }

      // Create a cookie with the token
      response.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Data to be sent in the response
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        walletAddress: user.walletAddress,
        accessToken: token,
      };

      // Send response
      response
        .status(200)
        .json(new apiResponse(200, userData, "User signed in successfully."));
    } catch (error) {
      // Handle error
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Internal server error.");
      }
    }
  }
);

// Get Current User Controller
export const getCurrentUser = asyncHandler(
  async (request: Request, response: Response) => {
    try {
      // Get user from request
      const user = request.user;

      // If user not found, throw an error and send response
      if (!user) {
        throw new apiError(401, "User not found.");
      }

      // Send response
      response.status(200).json(new apiResponse(200, user, "User fetched."));
    } catch (error) {
      // Handle error
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Internal server error.");
      }
    }
  }
);
