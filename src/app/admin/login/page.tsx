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
import { Eye, EyeOff, Lock, User } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

export default function AdminLogin() {
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
      const response = await api.post("/login/superuser/", data);

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
      if (response.data.is_superuser) {
        router.push("/admin");
        toast("Account logged in successfully");
      }
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4 overflow-hidden">
      <div className="absolute -right-64 -top-64 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl"></div>
      <div className="absolute -left-64 -bottom-64 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 blur-3xl"></div>
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-background/60 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-xl mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-1.5">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Login
            </span>
          </div>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <div className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-10 bg-background text-foreground border-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className=" space-y-2 ">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 bg-background text-foreground rounded-md"
                            {...field}
                          />
                          <Button
                            type="button"
                            size="icon"
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
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
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            <Link
              href="https://netwok.app"
              className="text-blue-500 hover:underline"
            >
              Return to homepage
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

