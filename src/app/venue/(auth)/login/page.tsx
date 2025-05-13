"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

export default function VenueLoginPage() {
  const { setUserDetails } = useUser();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.post("/login/venue_owner/", data);
      let userType = "";
      if (response.data.is_superuser) {
        userType = "superuser";
      } else if (response.data.is_customer) {
        userType = "customer";
      } else if (response.data.is_venue_owner) {
        userType = "venue_owner";
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          userType: userType,
          id: response.data.id,
        })
      );
      const user = {
        username: response.data.username,
        email: response.data.email,
        userType: userType,
        id: response.data.id,
      };
      setUserDetails(user);

      await axios.post("/api/setCookie", {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        isSuperuser: response.data.is_superuser,
  
      });
      router.push("/venue/");
      toast("Account logged in successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast(error.response.data.detail || "Invalid username or password");
      } else {
        toast("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link
          href="https://netwok.app"
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Home</span>
        </Link>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs px-3 py-1 h-auto"
            asChild
          >
            <Link href="/venue/registerVenue">Register Venue</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className=" rounded-xl p-2">
              <Image src="/logo.svg" alt="Logo" width={120} height={120} />
            </div>
          </div>

          <Card className="bg-gray-900/80 backdrop-blur-md border-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 flex items-center justify-center">
              <h2 className="text-xl font-medium text-white">Venue Login</h2>
            </div>
            <CardContent className="p-5">
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">
                    Sign in to manage your venue
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleLogin)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10  rounded-md "
                                  placeholder="Username"
                                  {...field}
                                />
                              </div>
                            </div>
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
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="#">
                              <p className="text-sm text-blue-400 hover:underline">
                                Forgot your password?
                              </p>
                            </Link>
                          </div>
                          <FormControl>
                            <div className=" space-y-2 ">
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  className="pl-10 rounded-md "
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  className="bg-transparent border-0 absolute right-3 top-3 h-4 w-4 text-muted-foreground "
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    Toggle password visibility
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>

                <div className="text-center text-sm">
                  <span className="text-gray-400">
                    Don&apos;t have a venue account?
                  </span>{" "}
                  <Link
                    href="/venue/signup"
                    className="text-blue-400 hover:underline"
                  >
                    Register now
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits for venues */}
          <div className="mt-8 space-y-4 text-gray-300">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full p-2 mt-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Create Connections</h3>
                <p className="text-sm text-gray-400">
                  Help visitors connect with like-minded people at your venue
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-4 text-gray-500 text-xs text-center">
        <p>© {new Date().getFullYear()} Netwok. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link
            href="https://netwok.app/terms"
            className="hover:text-gray-300 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="https://netwok.app/privacy"
            className="hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="https://netwok.app/contact"
            className="hover:text-gray-300 transition-colors"
          >
            Help
          </Link>
        </div>
      </footer>
    </div>
  );
}
