import type { Request, Response, NextFunction } from "express";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// This middleware verifies that a request has a valid wallet signature
export const verifyWalletSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the wallet address and signature from headers
    const walletAddress = req.headers["x-wallet-address"] as string;
    const signature = req.headers["x-wallet-signature"] as string;
    const message = req.headers["x-wallet-message"] as string;

    // Check if all required headers are present
    if (!walletAddress || !signature || !message) {
      return res.status(401).json({
        error:
          "Authentication required: wallet address, signature, and message are required",
      });
    }

    // Find the user by wallet address
    const userResult = await db.query.users.findFirst({
      where: eq(users.walletAddress, walletAddress),
    });

    if (!userResult) {
      return res.status(401).json({ error: "User not found" });
    }

    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);

    // Convert signature from base58 to Uint8Array
    const signatureBytes = bs58.decode(signature);

    // Convert wallet address from base58 to Uint8Array public key
    const publicKeyBytes = bs58.decode(walletAddress);

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    // Check if the signature is valid
    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Attach the user to the request
    req.user = userResult;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
