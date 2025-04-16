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
} from "../validations/user.validation.js";
import { or, eq } from "drizzle-orm";
import { users } from "../db/schema.js";

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
        })
        .returning();

      // If user is not created, throw an error and send response
      if (!newUser) {
        throw new apiError(400, "User could not be created.");
      }

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
      response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Send response
      response
        .status(200)
        .json(new apiResponse(200, { token }, "User signed in successfully."));
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
