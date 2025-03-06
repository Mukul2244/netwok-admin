import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "../ui/button";

export default function RestaurantsTab() {
  const [restaurants, setRestaurants] = useState<{
    id: number;
    name: string;
  }[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await api.get(`/restaurants/?owner=${id}`);
      setRestaurants(response.data);
      // Check if a restaurant is already selected
      const restaurantId = localStorage.getItem("selectedRestaurantId");
      if (restaurantId) {
        setSelectedRestaurantId(restaurantId);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    const selectedRestaurantId = localStorage.getItem("restaurantId");
    setSelectedRestaurantId(selectedRestaurantId);
    // Fetch restaurants when the component mounts
    fetchRestaurants();
  }, []);

  const handleSelectRestaurant = (restaurantId: number) => {
    localStorage.setItem("restaurantId", restaurantId.toString());
    setSelectedRestaurantId(restaurantId.toString());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">List of Restaurants</h1>
      {restaurants.length > 0 ? (
        <div>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`bg-white shadow-md p-4 mb-4 rounded-md ${selectedRestaurantId === restaurant.id.toString() ? "border-2 border-blue-500" : ""
                }`}
            >
              <h2 className="text-lg font-bold">{restaurant.name}</h2>
              <Button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => handleSelectRestaurant(restaurant.id)}
              >
                Select Restaurant
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div>No restaurant found. Please contact the admin.</div>
      )}
    </div>
  );
}
