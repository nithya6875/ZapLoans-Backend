import type { Request, Response } from "express";
import nacl from "tweetnacl";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bs58 from "bs58";
import { randomBytes } from "crypto";

// Store nonces in memory (in production, use a database or Redis)
const nonceStore: Record<string, { nonce: string; createdAt: number }> = {};

// Time validity for nonce (5 minutes)
const NONCE_EXPIRY = 5 * 60 * 1000;

// Clean up expired nonces
const cleanupNonces = () => {
  const now = Date.now();
  Object.keys(nonceStore).forEach((address) => {
    if (now - nonceStore[address].createdAt > NONCE_EXPIRY) {
      delete nonceStore[address];
    }
  });
};

// Run cleanup every minute
setInterval(cleanupNonces, 60 * 1000);

export const authController = {
  // Generate a nonce for a wallet address
  getNonce: (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress || typeof walletAddress !== "string") {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Generate a random nonce
      const nonce = randomBytes(32).toString("hex");
      
      // Store the nonce with creation timestamp
      nonceStore[walletAddress] = {
        nonce,
        createdAt: Date.now(),
      };

      return res.status(200).json({ nonce });
    } catch (error) {
      console.error("Error generating nonce:", error);
      return res.status(500).json({ error: "Failed to generate nonce" });
    }
  },

  // Get user by wallet address
  getUserByWallet: async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress || typeof walletAddress !== "string") {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Find user by wallet address
      const user = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user: user[0] });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  },

  // Authenticate or register user with wallet
  loginWithWallet: async (req: Request, res: Response) => {
    try {
      const { username, walletAddress, email, signature } = req.body;
      
      if (!walletAddress || !signature) {
        return res.status(400).json({ error: "Wallet address and signature are required" });
      }

      // Check if nonce exists for this wallet
      if (!nonceStore[walletAddress]) {
        return res.status(400).json({ error: "No nonce found for this wallet. Please request a new one." });
      }

      const { nonce, createdAt } = nonceStore[walletAddress];
      
      // Check if nonce has expired
      if (Date.now() - createdAt > NONCE_EXPIRY) {
        delete nonceStore[walletAddress];
        return res.status(400).json({ error: "Nonce has expired. Please request a new one." });
      }

      // Create the message that was signed
      const messageToVerify = `Verify wallet ownership: ${walletAddress}\nNonce: ${nonce}`;
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
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Signature is valid, find or create user
      let user = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
      
      if (user.length === 0) {
        // Create new user
        if (!username) {
          return res.status(400).json({ error: "Username is required for registration" });
        }
        
        const newUser = await db.insert(users).values({
          username,
          walletAddress,
          email: email || null,
        }).returning();
        
        user = newUser;
      }

      // Remove used nonce
      delete nonceStore[walletAddress];

      return res.status(200).json({ user: user[0] });
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ error: "Authentication failed" });
    }
  },
}; 