import { z } from "zod";

// This schema is used to validate the data for signing up a new user.
export const signUpUserSchema = z.object({
  username: z
    .string({
      required_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
});

// This type is used to infer the type of the signUpUserSchema
export type SignUpUserSchemaType = z.infer<typeof signUpUserSchema>;

// This schema is used to validate the data for verifying a user.
export const verifyUserSchema = z.object({
  username: z
    .string({
      required_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
  otp: z
    .string({
      required_error: "OTP is required",
    })
    .length(6, "OTP must be exactly 6 characters long"),
});

// This type is used to infer the type of the verifyUserSchema
export type VerifyUserSchemaType = z.infer<typeof verifyUserSchema>;

// This schema is used to validate the data for logging in a user.
export const signInUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
});

// This type is used to infer the type of the loginUserSchema
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;
