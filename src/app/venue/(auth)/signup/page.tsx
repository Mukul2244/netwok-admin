
"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";

import { formSchema } from "@/schemas/RegisterOwnerSchema";

interface Register{
    first_name: string;
    last_name:string;
    email: string;
    username:string;
    password: string;
    gender:string;
}
export default function VenueRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      gender: "",
    },
  });

  // Form submission handler
  const handleRegister = async (values:Register) => {
    setIsLoading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Append all form values to the FormData object
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      console.log("Sending form data:", values);

const response = await api.post("/register/venue_owner/", formData);

if(response.status==200 || response.status==201){
  toast.success("Registration successful!");
  router.push("/venue/login");
}


    }  catch (error) {
        
const axiosError = error as AxiosError;
  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data;

    if (status === 400) {
      // Try to show detailed validation errors if available
      if (typeof data === 'string') {
        toast.error(data);
      } else if (typeof data === 'object') {
        // Show all error messages from the response
        const messages = Object.values(data ?? {}).flat().join(' ') || "Something went wrong.";

        toast.error(messages || "Bad request. Please check the form.");
      } else {
        toast.error("Bad request. Please check the form.");
      }
    } else {
      toast.error("Registration failed. Please try again.");
    }

  } else {
    // Network or other error
    toast.error("An unexpected error occurred. Please try again.");
    console.error("Unexpected error:", error);
  }

  }
      
       finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
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
            <Link href="/venue/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-4 py-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-xl p-2">
              <Image src="/logo.svg" alt="Logo" width={120} height={120} />
            </div>
          </div>

          <Card className="bg-gray-900/80 backdrop-blur-md border-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 flex items-center justify-center">
              <h2 className="text-xl font-medium text-white">Venue Registration</h2>
            </div>
            <CardContent className="p-5">
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">
                    Register to create your venue account
                  </p>
                </div>

                <Form {...form}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-md"
                                placeholder="First Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-md"
                                placeholder="Last Name"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10 rounded-md"
                                placeholder="Email"
                                type="email"
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
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10 rounded-md"
                                placeholder="Username"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pl-10 rounded-md"
                                {...field}
                              />
                              <Button
                                type="button"
                                size="icon"
                                className="bg-transparent border-0 absolute right-3 top-3 h-4 w-4 text-muted-foreground"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-md">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      onClick={form.handleSubmit(handleRegister)}
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register"}
                    </Button>
                  </div>
                </Form>

                <div className="text-center text-sm">
                  <span className="text-gray-400">
                    Already have a venue account?
                  </span>{" "}
                  <Link
                    href="/venue/login"
                    className="text-blue-400 hover:underline"
                  >
                    Login now
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

      {/* Footer */}
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