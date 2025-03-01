import { z } from "zod"

 const offerSchema = z.object({
  description: z.string().nonempty("Description is required"),
  time_based: z.boolean(),
  time_duration_hours: z.number(),
})

export const settingSchema = z.object({
  restaurantName: z
    .string(),
  restaurantDescription: z
    .string(),
  qrCodeGenerationFrequency: z
    .string(),
  logo: z
    .any()
    .nullable(),
  offers: z
    .array(offerSchema),
})





