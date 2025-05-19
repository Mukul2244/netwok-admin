import { z } from "zod"

export const formSchema = z.object({
    first_name: z.string()
      .min(2, { message: "First name must have at least 2 characters" })
      .max(50, { message: "First name must be under 50 characters" })
      .refine((val) => /^[A-Za-z\s]+$/.test(val), {
        message: "First name must contain only letters and spaces",
      }),


    last_name: z.string()
      .min(2, { message: "Last name must have at least 2 characters" })
      .max(50, { message: "Last name must be under 50 characters" })
      .refine((val) => /^[A-Za-z\s]+$/.test(val), {
        message: "Last name must contain only letters and spaces",
      }),

  
    email: z.string()
      .email({ message: "Enter a valid email address" }),
  
    username: z.string()
      .min(3, { message: "Username must have at least 3 characters" })
      .max(20, { message: "Username must be under 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
  
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password is too long" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
      invalid_type_error: "Invalid gender selection",
    }),
  });
  