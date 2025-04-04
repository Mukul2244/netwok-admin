"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserInterface } from "@/interfaces/User";
import api from "@/lib/axios";

export default function UsersTab() {
  const [selectedUser, setSelectedUser] = useState<UserInterface[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Access localStorage only after the component has mounted
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!restaurantId) return;
      try {
        const response = await api.get(`/restaurants/${restaurantId}/`);
        const ids = response.data.customers;
        const usernames = response.data.customers_usernames;
        const mergedCustomers = ids.map((id: number, index: number) => ({
          id: id,
          username: usernames[index],
        }));
        setSelectedUser(mergedCustomers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [restaurantId]);

  if (!restaurantId)
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground">
          Restaurant not found
        </h1>
        <p className="text-muted-foreground">
          Please ensure you have selected a restaurant.
        </p>
      </div>
    );

  return (
    <Card className="col-span-4 bg-background shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-amber-700 dark:to-orange-800">
        <CardTitle>User Management</CardTitle>
        <CardDescription className="text-amber-100 dark:text-amber-200">
          View and interact with your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {selectedUser.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-amber-500 dark:text-amber-400 ">No user found</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] bg-gradient-to-br ">
            {selectedUser.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between mb-4 p-4 hover:bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 border-2 border-zinc-300 dark:border-zinc-700">
                    <AvatarImage src={``} alt={user.username} />
                    <AvatarFallback>
                      {user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                      {user.username}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}