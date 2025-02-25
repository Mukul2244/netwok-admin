"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const offerSchema = z.object({
  description: z.string().nonempty("Description is required"),
  isTimeBased: z.boolean(),
  duration: z.string().optional(),
})

const settingsSchema = z.object({
  restaurantName: z.string().nonempty("Restaurant name is required"),
  restaurantDescription: z.string().optional(),
  qrCodeGenerationFrequency: z.string().nonempty("QR code generation frequency is required"),
  logo: z.string().optional(),
  offers: z.array(offerSchema),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsTab() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      restaurantName: 'The Tipsy Tavern',
      restaurantDescription: '',
      qrCodeGenerationFrequency: 'daily',
      logo: '',
      offers: [
        {
          description: '10% off on all orders',
          isTimeBased: false,
          duration: '',
        },
      ],
    },
  })

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => form.setValue("logo", reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addOffer = () => {
    form.setValue("offers", [
      ...form.getValues("offers"),
      {
        description: '',
        isTimeBased: false,
        duration: '',
      },
    ])
  }

  const removeOffer = (index: number) => {
    const updatedOffers = form.getValues("offers").filter((_, i) => i !== index)
    form.setValue("offers", updatedOffers)
  }

  const generateQRCode = () => {
    // Generate QR code
  }

  const saveRestaurantDetails = (data: SettingsFormValues) => {
    // Save restaurant details
    console.log(data)
  }

  return (
    <Card className="col-span-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <CardTitle>Restaurant Details</CardTitle>
        <CardDescription className="text-pink-100">Update your restaurant information and offers</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveRestaurantDetails)} className="space-y-6">
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your restaurant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="restaurantDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your restaurant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src={field.value} alt="Restaurant logo" />
                      <AvatarFallback>LOGO</AvatarFallback>
                    </Avatar>
                    <Input type="file" onChange={handleLogoUpload} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qrCodeGenerationFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code Generation Frequency</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offers</FormLabel>
                  {field.value.map((offer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          placeholder={`Offer ${index + 1}`}
                          value={offer.description}
                          onChange={(e) => form.setValue(`offers.${index}.description`, e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <Switch
                          checked={offer.isTimeBased}
                          onCheckedChange={(checked) => form.setValue(`offers.${index}.isTimeBased`, checked)}
                        />
                      </FormControl>
                      {offer.isTimeBased && (
                        <FormControl>
                          <Input
                            placeholder="Duration (e.g., 2 hours)"
                            value={offer.duration}
                            onChange={(e) => form.setValue(`offers.${index}.duration`, e.target.value)}
                          />
                        </FormControl>
                      )}
                      <Button type="button" variant="outline" size="icon" onClick={() => removeOffer(index)} className="text-rose-500 hover:text-rose-600">
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addOffer} className="mt-2 text-pink-600 hover:text-pink-700 border-pink-300 hover:border-pink-400">
                    Add Offer
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={generateQRCode} className="bg-white text-pink-600 hover:bg-pink-50">
                Generate New QR Code
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

