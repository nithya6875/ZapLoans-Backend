import { Router } from "express";
import { authController } from "../controllers/auth.controller";

// Create a new router instance for authentication routes
const authRouter = Router();

// Route to get a nonce for signature
authRouter.get("/nonce", authController.getNonce as any);

// Route to get user by wallet address
authRouter.get("/", authController.getUserByWallet as any);

// Route to login/register with wallet
authRouter.post("/", authController.loginWithWallet as any);

// Export the auth router
export default authRouter;