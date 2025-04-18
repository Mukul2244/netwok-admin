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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import { useUser } from "@/context/user-context";
import { LoginSchema } from "@/schemas/LoginSchema";
import Image from "next/image";

export default function Login() {
  const { setUserDetails } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await api.post("/api/token/", data);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.user.username,
          email: response.data.user.email,
          id: response.data.user.id,
        })
      );
      setUserDetails(response.data.user);

      await axios.post("/api/setCookie", {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        isSuperuser: response.data.user.is_superuser,
      });
      if (response.data.user.is_superuser) {
        router.push("/admin");
      } else {
        router.push("/restaurant");
      }
      toast("Login successful");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast(error.response.data.detail || "Invalid username or password");
      } else {
        toast("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-800 dark:from-indigo-900 dark:to-purple-900 p-4 sm:p-6">
      <div className="w-full max-w-md max-h-lg bg-background rounded-lg shadow-xl overflow-hidden p-6">
        <div className="space-y-4">
          {/* Add the logo at the top */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-3xl font-bold text-center text-indigo-800 dark:text-indigo-200 mb-6">
            Login to the dashboard
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background text-foreground border-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your username"
                        aria-label="Username"
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
                        className="bg-background text-foreground border-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your password"
                        aria-label="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                disabled={loading}
                aria-busy={loading}
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
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}