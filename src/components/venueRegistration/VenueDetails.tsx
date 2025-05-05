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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { venueDetailsSchema } from "@/schemas/RegisterSchema";
import { ChevronRight } from "lucide-react";

type VenueDetailsForm = z.infer<typeof venueDetailsSchema>;

const venueTypes = [
  { value: "restaurant", label: "Restaurant" },
  { value: "bar", label: "Bar" },
  { value: "cafe", label: "Café" },
  { value: "pub", label: "Pub" },
  { value: "club", label: "Nightclub" },
  { value: "lounge", label: "Lounge" },
  { value: "brewery", label: "Brewery" },
  { value: "winery", label: "Winery" },
  { value: "event-space", label: "Event Space" },
  { value: "coworking", label: "Coworking Space" },
];

interface Props {
  data: VenueDetailsForm;
  updateData: (values: VenueDetailsForm) => void;
  onNext: () => void;
}

export default function VenueDetails({ data, updateData, onNext }: Props) {
  const form = useForm<VenueDetailsForm>({
    resolver: zodResolver(venueDetailsSchema),
    defaultValues: {
      venueName: data.venueName || "",
      venueType: data.venueType || "",
      capacity: data.capacity || 0,
      description: data.description || "",
    },
  });

  const onSubmit = (values: VenueDetailsForm) => {
    updateData(values);
    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">
          Register Your Venue
        </h2>
        <p className="text-sm text-gray-400">
          Connect visitors at your establishment
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="venueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Venue Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter your venue name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venueType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Venue Type
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500 ">
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {venueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="capacity" className="text-sm text-gray-300">
                  Venue Capacity (approx.)
                </FormLabel>
                <FormControl>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Estimated maximum capacity"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Venue Description
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Tell visitors about your venue"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-xl"
          >
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
