# Zaploans-Backend

## Getting Started

To install dependencies:

```bash
bun install
```

Generate Drizzle client:

```bash
bunx drizzle-kit generate
```

To run:

```bash
bun run start
```

## Backend Flow

### Architecture Overview

The ZapLoans backend is built with Express.js and TypeScript, using PostgreSQL as the database with Drizzle ORM for database operations. Redis is used for OTP storage and temporary data caching.

### Core Components

- **Server Setup** (`src/server.ts`): The entry point that initializes Express, middleware, and routes.
- **Database** (`src/db/`): Uses Drizzle ORM with PostgreSQL for data persistence.
- **Routes** (`src/routes/`): API endpoint definitions and route handlers.
- **Controllers** (`src/controllers/`): Business logic for handling requests.
- **Middlewares** (`src/middlewares/`): Authentication and request processing middleware.
- **Validations** (`src/validations/`): Schema validation using Zod.
- **Utils** (`src/utils/`): Helper functions and utilities.

### API Flow

1. **User Authentication Flow**:
   - **Sign Up**: 
     - User submits username, email, and password
     - Password is hashed with bcrypt
     - OTP is generated and sent to user's email
     - User record is created with `isVerified` set to false
   - **OTP Verification**:
     - User submits the OTP received in email
     - OTP is verified against Redis
     - User's `isVerified` status is updated to true
     - Welcome email is sent
   - **Sign In**:
     - User provides credentials
     - System verifies credentials and issues JWT token
     - Token is returned for authentication

2. **Wallet Integration Flow**:
   - **Get Nonce**:
     - User requests a nonce for a wallet address
     - System generates a random nonce
     - Nonce is stored in Redis with a 5-minute expiration
   - **Connect Wallet**:
     - User signs the nonce with their wallet
     - System retrieves the nonce from Redis
     - Signature is verified using TweetNaCl
     - Wallet address is associated with user account
     - Used nonce is deleted from Redis

### Data Schema

The system uses a PostgreSQL database with the following core entities:

- **Users**: Stores user information, authentication details, and wallet addresses
  - `id`: UUID primary key
  - `username`: Unique username
  - `email`: User's email address
  - `password`: Hashed password
  - `isVerified`: Boolean indicating email verification status
  - `walletAddress`: Optional wallet address when connected

### Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Email verification via OTP
- Secure wallet connection with cryptographic signatures
- Redis for OTP storage with expiration
