import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function RestaurantsTab() {
  const [restaurants, setRestaurants] = useState<{
    id: number;
    name: string;
  }[]
  >([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const id = localStorage.getItem("id");
        const response = await api.get(`/restaurants/?owner=${id}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> List of Restaurants</h1>
      {restaurants.length > 0 ? (
        <div>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white shadow-md p-4 mb-4 rounded-md"
            >
              <h2 className="text-lg font-bold">{restaurant.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div>No restaurants found.</div>
      )}
    </div>
  );
}
