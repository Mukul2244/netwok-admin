"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Store, User, FileText, Loader2 } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { PubRegisterSchema } from '@/schemas/PubRegisterSchema'
import { UserInterface } from '@/interfaces/User'
import api from '@/lib/axios'

export default function RegisterPubTab() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<z.infer<typeof PubRegisterSchema>>({
    resolver: zodResolver(PubRegisterSchema),
    defaultValues: {
      name: "",
      description: "",
      owner: "",
    },
  })

  const userList = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/users/")
      const users = response.data
      setUsers(users.filter((user: { is_superuser: boolean }) => (user.is_superuser === false)))
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load user list. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    userList()
  }, [])

  const onSubmit = async (data: z.infer<typeof PubRegisterSchema>) => {
    setIsSubmitting(true)
    try {
      await api.post("/restaurants/", data)
      toast.success("Restaurant registered successfully!", {
        description: `${data.name} has been added to the platform.`
      })
      form.reset()
    } catch (error) {
      console.error("Error registering restaurant:", error)
      toast.error("Failed to register restaurant", {
        description: "Please check your inputs and try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-2xl bg-background shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-2xl font-bold">Register New Restaurant</CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Add a new restaurant to the platform with an assigned owner.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-lg">Loading user data...</span>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                    <Store className="h-5 w-5" />
                    <h3>Restaurant Information</h3>
                  </div>
                  <Separator className="my-2" />
                </div>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Restaurant Name</FormLabel>
                      <FormDescription>
                        Enter the official name as it will appear on the platform.
                      </FormDescription>
                      <FormControl>
                        <Input 
                          placeholder="e.g. The Rustic Kitchen" 
                          className="h-11"
                          {...field} 
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
                      <FormLabel className="text-base">Description</FormLabel>
                      <FormDescription>
                        Provide a brief description about this restaurant.
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell customers what makes this restaurant special..." 
                          className="resize-none min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                    <User className="h-5 w-5" />
                    <h3>Ownership Details</h3>
                  </div>
                  <Separator className="my-2" />
                </div>
                
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Owner</FormLabel>
                      <FormDescription>
                        Assign a user who will manage this restaurant.
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a restaurant owner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.length === 0 ? (
                            <div className="p-2 text-center text-gray-500">
                              No eligible users found
                            </div>
                          ) : (
                            users.map((user) => (
                              <SelectItem 
                                key={user.id} 
                                value={user.username}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <div className="flex items-center">
                                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full p-1 mr-2">
                                    <User className="h-3 w-3" />
                                  </div>
                                  {user.username}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-900/30 px-6 py-4 flex justify-between items-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="px-6"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Register Restaurant
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}