"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function AnalyticsTab() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Access localStorage only after the component has mounted
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

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
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:from-purple-700 dark:to-indigo-800">
        <CardTitle>Customer Engagement Analytics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900 dark:to-indigo-800 rounded-lg flex items-center justify-center">
          <BarChart2 className="h-48 w-48 text-zinc-500 dark:text-zinc-300" />
        </div>
      </CardContent>
    </Card>
  );
}