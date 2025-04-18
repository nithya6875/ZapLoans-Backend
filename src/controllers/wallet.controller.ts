import type { Request, Response } from "express";
import nacl from "tweetnacl";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bs58 from "bs58";
import { randomBytes } from "crypto";
import asyncHandler from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiError";
import { redisClient } from "../lib/redis";

// Time validity for nonce (5 minutes)
const NONCE_EXPIRY = 5 * 60;

// Generate a nonce for a wallet address
export const getNonce = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.query;

      if (!walletAddress || typeof walletAddress !== "string") {
        throw new apiError(400, "Wallet address is required");
      }

      // Generate a random nonce
      const nonce = randomBytes(32).toString("hex");

      // Store the nonce in Redis with expiration
      const nonceKey = `nonce:${walletAddress}`;
      await redisClient.set(nonceKey, nonce, NONCE_EXPIRY);

      res.status(200).json(
        new apiResponse(200, { nonce }, "Nonce generated successfully")
      );
    } catch (error) {
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Failed to generate nonce");
      }
    }
  }
);

// Connect wallet to authenticated user
export const connectWallet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { walletAddress, signature } = req.body;
      
      // Check if user exists in the request
      if (!req.user || !req.user.id) {
        throw new apiError(401, "Authentication required");
      }
      
      const userId = req.user.id;

      if (!walletAddress || !signature) {
        throw new apiError(
          400, 
          "Wallet address and signature are required"
        );
      }

      // Get nonce from Redis
      const nonceKey = `nonce:${walletAddress}`;
      const nonce = await redisClient.get(nonceKey);

      // Check if nonce exists for this wallet
      if (!nonce) {
        throw new apiError(
          400, 
          "No nonce found for this wallet. Please request a new one."
        );
      }

      // Create the message that was signed
      const messageToVerify = `Connect wallet to user account: ${userId}\nNonce: ${nonce}`;
      const messageBytes = new TextEncoder().encode(messageToVerify);

      // Convert base58 signature to Uint8Array
      const signatureBytes = bs58.decode(signature);

      // Convert walletAddress from base58 to Uint8Array public key
      const publicKeyBytes = bs58.decode(walletAddress);

      // Verify the signature
      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!isValid) {
        throw new apiError(401, "Invalid signature");
      }

      // Update user with wallet address
      const updatedUser = await db
        .update(users)
        .set({ walletAddress })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser || updatedUser.length === 0) {
        throw new apiError(404, "User not found");
      }

      // Remove used nonce
      await redisClient.del(nonceKey);

      res.status(200).json(
        new apiResponse(
          200, 
          { user: updatedUser[0] }, 
          "Wallet connected successfully"
        )
      );
    } catch (error) {
      if (error instanceof apiError) {
        throw error;
      } else {
        throw new apiError(500, "Failed to connect wallet");
      }
    }
  }
);

// Export wallet controller functions for backwards compatibility
export const walletController = {
  getNonce,
  connectWallet,
};
