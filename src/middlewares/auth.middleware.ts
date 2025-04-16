// User Controllers By SOURAV BHOWAL
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

// Middleware to check if the user is authenticated
export const authMiddleware = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      // Get the token from the request headers
      const token =
        request.headers.authorization?.split(" ")[1] || request.cookies?.token;

      // If the token is not provided, send a 401 response
      if (!token) {
        throw new apiError(401, "Unauthorized. Please provide a token");
      }

      // Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string, {
        algorithms: ["HS256"],
      });

      // Find the user in the database
      const user = await db.query.users.findFirst({
        where: eq(users.id, (decodedToken as { id: string }).id),
      });

      // If the user is not found, send a 401 response
      if (!user) {
        throw new apiError(401, "Unauthorized. User not found");
      }

      // Attach the user to the request object
      request.user = decodedToken as CustomUser;

      // Call the next middleware
      next();
    } catch (error) {
      throw new apiError(401, "Unauthorized. Invalid token");
    }
  }
);
