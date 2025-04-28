import { z } from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must have at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters." })
    .max(32, { message: "Password cannot exceed 32 characters." }),
});