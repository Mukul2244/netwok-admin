import { z } from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username is required" })
    .max(32, { message: "Username is too long" }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Must contain at least one number")
    // .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
});