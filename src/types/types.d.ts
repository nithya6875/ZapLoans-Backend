// Custom User
interface CustomUser {
  id: string;
  username: string;
  email: string;
  walletAddress: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Custom Request
declare namespace Express {
  interface Request {
    user?: CustomUser;
  }
}
