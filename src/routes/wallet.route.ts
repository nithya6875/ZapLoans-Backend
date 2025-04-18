import { Router } from "express";
import { getNonce, connectWallet } from "../controllers/wallet.controller";
import { authMiddleware } from "../middlewares/auth.middleware.js";
  
// Create a new router instance for wallet routes
const walletRouter = Router();
  
// Route to get a nonce for signature
walletRouter.route("/nonce").get(getNonce);
  
// Route to connect wallet to authenticated user
walletRouter
  .route("/connect")
  .post(authMiddleware, connectWallet);
  
// Export the wallet router
export default walletRouter;