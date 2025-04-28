"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const venueLocationSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters."),
  country: z.string().min(2, "Country must be at least 2 characters."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters."),
});

type VenueLocationForm = z.infer<typeof venueLocationSchema>;

export default function VenueLocation({
  onNext,
}: {
  onNext: () => void;
}) {
  const form = useForm<VenueLocationForm>({
    resolver: zodResolver(venueLocationSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const onSubmit = (data: VenueLocationForm) => {
    console.log(data);
    onNext();
  };

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Venue Location</h2>
        <p className="text-sm text-gray-400">
          Help visitors find your establishment
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main Street"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    State/Province
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="State"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Postal code"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="(123) 456-7890"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-xl"
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
