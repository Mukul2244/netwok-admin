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
import { paymentDetailsSchema } from "@/schemas/RegisterSchema";
type PaymentDetailsForm = z.infer<typeof paymentDetailsSchema>;

export default function PaymentDetails() {
  const form = useForm<PaymentDetailsForm>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = (data: PaymentDetailsForm) => {
    console.log(data);
    alert("Payment details submitted successfully!");
  };

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Payment Details</h2>
        <p className="text-sm text-gray-400">Set up your subscription</p>
      </div>
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-white">Professional Plan</div>
          <div className="text-lg font-bold text-white">
            $79<span className="text-sm font-normal text-gray-400">/mo</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-3">
          Up to 200 concurrent users
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <svg
            className="h-4 w-4 text-green-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          First month free
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500 pl-10"
                      {...field}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                      <svg className="h-6 w-6" viewBox="0 0 24 16" fill="none">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="23"
                          height="15"
                          rx="1.5"
                          fill="#252525"
                          stroke="#333333"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="4"
                          fill="#EB001B"
                          fillOpacity="0.8"
                        />
                        <circle
                          cx="16"
                          cy="8"
                          r="4"
                          fill="#F79E1B"
                          fillOpacity="0.8"
                        />
                        <path
                          d="M12 4.5C13.3 5.5 14 7 14 8.5C14 10 13.3 11.5 12 12.5C10.7 11.5 10 10 10 8.5C10 7 10.7 5.5 12 4.5Z"
                          fill="#FF5F00"
                          fillOpacity="0.8"
                        />
                      </svg>
                      <svg className="h-6 w-6" viewBox="0 0 24 16" fill="none">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="23"
                          height="15"
                          rx="1.5"
                          fill="#252525"
                          stroke="#333333"
                        />
                        <path
                          d="M9 11.5H15V4.5H9V11.5Z"
                          fill="#2566AF"
                          fillOpacity="0.8"
                        />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Expiry Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
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
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">CVC</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="123"
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
            name="cardHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Name on Card
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="John Smith"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Billing Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="123 Main St"
                      className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Zip Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12345"
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
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

          <div className="">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-xl"
            >
            Subscribe & Complete Setup
            </Button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Your subscription will begin after your free trial. You can cancel
              anytime.
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
