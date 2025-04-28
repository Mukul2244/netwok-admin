import { z } from "zod"
export const RegisterSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(32, { message: "Username is too long" }),
  
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(3, { message: "Email must be at least 3 characters" })
      .max(32, { message: "Email is too long" })
    ,
    password:z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(32, { message: "Password is too long" })
  })


 export const venueDetailsSchema = z.object({
    venueName: z.string().min(3, "Venue name must be at least 3 characters."),
    venueType: z.string().nonempty("Please select a venue type."),
    capacity: z.number().min(1, "Capacity must be at least 1."),
    description: z.string().optional(),
  });


  export const accountSetupSchema = z.object({
    name: z
      .string()
      .min(3, { message: "name must be at least 3 characters" })
      .max(32, { message: "name is too long" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(3, { message: "Email must be at least 3 characters" })
      .max(32, { message: "Email is too long" }),
    position: z
      .string(),
    plan: z
      .string()
      .nonempty({ message: "Please select a plan" }),

  });


  export const paymentDetailsSchema = z.object({
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid expiry date format (MM/YY)" }),
    cvv: z
      .string()
      .regex(/^\d{3}$/, { message: "CVV must be 3 digits" }),
    cardHolderName: z
      .string()
      .min(3, { message: "Cardholder name must be at least 3 characters" })
      .max(32, { message: "Cardholder name is too long" }),
    billingAddress: z
      .string()
      .min(3, { message: "Billing address must be at least 3 characters" })
      .max(100, { message: "Billing address is too long" }),
    city: z
      .string()
      .min(3, { message: "City must be at least 3 characters" })
      .max(32, { message: "City is too long" }),
    country: z
      .string()
      .min(3, { message: "Country must be at least 3 characters" })
      .max(32, { message: "Country is too long" }),
    zipCode: z
      .string()
      .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" }),
  });