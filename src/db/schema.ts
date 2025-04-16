import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// This is the schema for the users table
export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  walletAddress: text("walletAddress").unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Type for the users table
export type SelectUserType = InferSelectModel<typeof users>;
