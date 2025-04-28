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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { accountSetupSchema } from "@/schemas/RegisterSchema";

type AccountSetupForm = z.infer<typeof accountSetupSchema>;

export default function AccountSetup({
  onNext,
}: {
  onNext: () => void;
}) {
  const form = useForm<AccountSetupForm>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      plan: "",
    },
  });

  const onSubmit = (data: AccountSetupForm) => {
    console.log(data);
    onNext();
  };

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Account Setup</h2>
        <p className="text-sm text-gray-400">Create your venue admin account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact@yourvenue.com"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Contact Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
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
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Your Position
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Manager, Owner, etc."
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
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Subscription Plan
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="space-y-3"
                  >
                    {/* Starter Plan */}
                    <div className="flex items-center justify-between space-x-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="starter" id="starter" />
                        <FormLabel
                          htmlFor="starter"
                          className="font-normal cursor-pointer"
                        >
                          <div className="text-sm font-medium">Starter</div>
                          <div className="text-xs text-gray-400">
                            Up to 50 concurrent users
                          </div>
                        </FormLabel>
                      </div>
                      <div className="text-sm font-medium">$29/mo</div>
                    </div>

                    {/* Professional Plan */}
                    <div className="flex items-center justify-between space-x-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="professional"
                          id="professional"
                        />
                        <FormLabel
                          htmlFor="professional"
                          className="font-normal cursor-pointer"
                        >
                          <div className="text-sm font-medium">
                            Professional
                          </div>
                          <div className="text-xs text-gray-400">
                            Up to 200 concurrent users
                          </div>
                        </FormLabel>
                      </div>
                      <div className="text-sm font-medium">$79/mo</div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="flex items-center justify-between space-x-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enterprise" id="enterprise" />
                        <FormLabel
                          htmlFor="enterprise"
                          className="font-normal cursor-pointer"
                        >
                          <div className="text-sm font-medium">Enterprise</div>
                          <div className="text-xs text-gray-400">
                            Unlimited users
                          </div>
                        </FormLabel>
                      </div>
                      <div className="text-sm font-medium">$199/mo</div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button 
             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-xl"
            type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
