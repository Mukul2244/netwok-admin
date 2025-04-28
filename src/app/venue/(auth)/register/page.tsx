"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { RegisterSchema } from "@/schemas/RegisterSchema";
import Image from "next/image";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    try {
      await api.post("/users/", data);
      toast("Account created successfully");
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-800 dark:from-indigo-900 dark:to-purple-900 p-4">
      <div className="w-full max-w-md max-h-lg bg-background rounded-lg shadow-xl overflow-hidden p-6">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-3xl font-bold text-center text-indigo-800 dark:text-indigo-200 mb-6">
            Join the Netwok
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        aria-label="Email"
                        className="bg-background text-foreground border-border focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        aria-label="Username"
                        className="bg-background text-foreground border-border focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        aria-label="Password"
                        className="bg-background text-foreground border-border focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 dark:from-indigo-700 dark:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <p className="text-center text-muted-foreground text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/venue/login"
              className="text-indigo-600 dark:text-indigo-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
