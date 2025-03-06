"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema } from "@/schemas/PubSettingSchema";
import api from "@/lib/axios";

type SettingsFormValues = z.infer<typeof settingSchema>;

export default function SettingsTab() {
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      restaurantName: "",
      restaurantDescription: "",
      qrCodeGenerationFrequency: "",
      logo: null,
      offers: [],
    },
  });
  const { control, handleSubmit, setValue, getValues, watch } = form;
  const restaurantId = localStorage.getItem("restaurantId");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const addOffer = () => {
    setValue("offers", [
      ...getValues("offers"),
      {
        description: "",
        time_based: false,
        time_duration_hours: 0,
      },
    ]);
  };

  const removeOffer = (index: number) => {
    const updatedOffers = getValues("offers").filter((_, i) => i !== index);
    setValue("offers", updatedOffers);
  };

  const saveRestaurantDetails = async (data: SettingsFormValues) => {
    const formData = new FormData();
    formData.append("name", data.restaurantName);
    formData.append("description", data.restaurantDescription);
    formData.append("qr_gen_frequency_text", data.qrCodeGenerationFrequency);
    formData.append("offers", JSON.stringify(data.offers));
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    try {
      const response = await api.patch(`/restaurants/${restaurantId}/`, formData);
      console.log("Restaurant details saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving restaurant details:", error);
    }
  };

  if (!restaurantId) return (
    <div>
      <h1>Restaurant not found</h1>
    </div>
  );

  return (
    <Card className="col-span-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <CardTitle>Restaurant Details</CardTitle>
        <CardDescription className="text-pink-100">
          Update your restaurant information and offers
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(saveRestaurantDetails)}
            className="space-y-6"
          >
            <FormField
              control={control}
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
              control={control}
              name="restaurantDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your restaurant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Logo */}
            <FormField
              control={control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src={preview || ""} alt="Restaurant logo" />
                      <AvatarFallback>LOGO</AvatarFallback>
                    </Avatar>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="qrCodeGenerationFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code Generation Frequency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              control={control}
              name="offers"
              render={() => (
                <FormItem>
                  <FormLabel>Offers</FormLabel>
                  {watch("offers").map((offer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          placeholder={`Offer ${index + 1}`}
                          value={offer.description}
                          onChange={(e) => {
                            const offers = getValues("offers");
                            offers[index].description = e.target.value;
                            setValue("offers", [...offers]);
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <Switch
                          checked={offer.time_based}
                          onCheckedChange={(checked) => {
                            const offers = getValues("offers");
                            offers[index].time_based = checked;
                            offers[index].time_duration_hours = 0;
                            setValue("offers", [...offers]);
                          }}
                        />
                      </FormControl>
                      {offer.time_based && (
                        <FormControl>
                          <Input
                            placeholder="Duration (e.g., 2 hours)"
                            value={offer.time_duration_hours}
                            onChange={(e) => {
                              const offers = getValues("offers");
                              offers[index].time_duration_hours = Number(e.target.value);
                              setValue("offers", [...offers]);
                            }}
                          />
                        </FormControl>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOffer(index)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOffer}
                    className="mt-2 text-pink-600 hover:text-pink-700 border-pink-300 hover:border-pink-400"
                  >
                    Add Offer
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
