"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

// Utility function to safely parse JSON from localStorage
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
  const [restaurants, setRestaurants] = useState<{
    id: number;
    name: string;
    var_id: string;
  }[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // Fetch restaurants for the logged-in user
  const fetchRestaurants = async (userId: string) => {
    try {
      const response = await api.get(`/restaurants/?owner=${userId}`);
      setRestaurants(response.data);

      // Check if a restaurant is already selected
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
    // Ensure localStorage access only happens on the client side
    const user = safeParseJSON("user");
    if (user && user.id) {
      fetchRestaurants(user.id.toString());
    } else {
      console.log("User details not found in localStorage.");
    }
  }, []);

  const handleSelectRestaurant = (restaurantId: number, qrCodeNumber: string) => {
    try {
      localStorage.setItem("restaurantId", restaurantId.toString());
      setSelectedRestaurantId(restaurantId.toString());
      localStorage.setItem("qrCodeNumber", qrCodeNumber.toString());
    } catch (error) {
      console.error("Error saving restaurant selection to localStorage:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground">List of Restaurants</h1>
      {restaurants.length > 0 ? (
        <div>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`bg-background text-foreground shadow-md p-4 mb-4 rounded-md transition-all ${
                selectedRestaurantId === restaurant.id.toString()
                  ? "border-2 border-blue-500 dark:border-blue-400"
                  : "border border-border"
              }`}
            >
              <h2 className="text-lg font-bold">{restaurant.name}</h2>
              <Button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                onClick={() => handleSelectRestaurant(restaurant.id, restaurant.var_id)}
              >
                Select Restaurant
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No restaurant found. Please contact the admin.</div>
      )}
    </div>
  );
}