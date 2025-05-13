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
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password is too long" })
})



export const venueDetailsSchema = z.object({
  venueName: z
    .string()
    .min(1, { message: "Venue name is required" })
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Venue name must contain only letters and spaces",
    }),

  venueType: z.string().min(1, { message: "Venue type is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  description: z.string().optional(),
});



export const accountSetupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(32, { message: "Name is too long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(64, { message: "Email is too long" }),

  position: z
    .string()
    .min(2, { message: "Position must be at least 2 characters" })
    .max(50, { message: "Position is too long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Position can only contain letters and spaces",
    }),

  plan: z
    .string()
    .nonempty({ message: "Please select a plan" }),
});


// Luhn algorithm to validate card numbers
function isValidCardNumber(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export const paymentDetailsSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" })
    .refine(isValidCardNumber, { message: "Invalid card number" }),

  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid expiry date format (MM/YY)" })
    .refine((date) => {
      const [month, year] = date.split("/").map(Number);
      const now = new Date();
      const currentYear = Number(now.getFullYear().toString().slice(-2));
      const currentMonth = now.getMonth() + 1;
      return year > currentYear || (year === currentYear && month >= currentMonth);
    }, { message: "Card has expired" }),

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
    .min(2, { message: "City must be at least 2 characters" })
    .max(32, { message: "City is too long" }),

    country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" })
    .max(32, { message: "Country is too long" })
    .regex(/^[A-Za-z\s]+$/, { message: "Country name can only contain letters and spaces" }),
  
  zipCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" }),
});



export const venueLocationSchema = z.object({
  address: z
    .string()
    .min(5, "Address must be at least 5 characters.")
    .max(100, "Address can't be more than 100 characters."),
    
  city: z
    .string()
    .min(2, "City must be at least 2 characters.")
    .regex(/^[A-Za-z\s]+$/, "City must contain only letters and spaces."),

  state: z
    .string()
    .min(2, "State must be at least 2 characters.")
    .regex(/^[A-Za-z\s]+$/, "State must contain only letters and spaces."),

  postalCode: z
    .string()
    .regex(/^\d{4,10}$/, "Postal code must be between 4 and 10 digits."),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters.")
    .regex(/^[A-Za-z\s]+$/, "Country must contain only letters and spaces."),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),
});
