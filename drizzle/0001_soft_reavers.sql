ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "walletAddress" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_walletAddress_unique" UNIQUE("walletAddress");