"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2 } from "lucide-react";

// Utility function
const safeParseJSON = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

export default function RestaurantsTab() {
  const [restaurants, setRestaurants] = useState<
    { id: number; name: string; var_id: string }[]
  >([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const fetchRestaurants = async (userId: string) => {
    try {
      const response = await api.get(`/restaurants/?owner=${userId}`);
      setRestaurants(response.data);

      const restaurantId = localStorage.getItem("restaurantId");
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");

      if (restaurantId && qrCodeNumber) {
        setSelectedRestaurantId(restaurantId);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    const user = safeParseJSON("user");
    if (user && user.id) {
      fetchRestaurants(user.id.toString());
    }
  }, []);

  const handleSelectRestaurant = (restaurantId: number, qrCodeNumber: string) => {
    try {
      localStorage.setItem("restaurantId", restaurantId.toString());
      setSelectedRestaurantId(restaurantId.toString());
      localStorage.setItem("qrCodeNumber", qrCodeNumber.toString());
    } catch (error) {
      console.error("Error saving restaurant selection:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">🍽️ Your Restaurants</h1>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => {
            const isSelected = selectedRestaurantId === restaurant.id.toString();
            return (
              <div
                key={restaurant.id}
                className={`relative p-5 rounded-xl border transition-all duration-300 shadow-sm ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400"
                    : "border-border hover:shadow-md bg-card dark:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="text-primary dark:text-blue-400" />
                  <h2 className="text-xl font-semibold text-foreground dark:text-zinc-100">
                    {restaurant.name}
                  </h2>
                  {isSelected && (
                    <CheckCircle2 className="text-green-500 dark:text-green-400 ml-auto" />
                  )}
                </div>

                <Button
                  variant="default"
                  className={`w-full mt-4 ${
                    isSelected
                      ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      : "bg-muted text-foreground hover:bg-muted/80 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  }`}
                  onClick={() => handleSelectRestaurant(restaurant.id, restaurant.var_id)}
                >
                  {isSelected ? "Selected" : "Select Restaurant"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground text-lg text-center mt-10 dark:text-zinc-400">
          No restaurants found. Please contact admin.
        </div>
      )}
    </div>
  );
}