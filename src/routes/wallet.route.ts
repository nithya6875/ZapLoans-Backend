import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";

// Create a new router instance for authentication routes
const walletRouter = Router();

// Route to get a nonce for signature
walletRouter.get("/nonce", walletController.getNonce as any);

// Route to get user by wallet address
walletRouter.get("/", walletController.getUserByWallet as any);

// Route to login/register with wallet
walletRouter.post("/", walletController.loginWithWallet as any);

// Export the auth router
export default walletRouter;