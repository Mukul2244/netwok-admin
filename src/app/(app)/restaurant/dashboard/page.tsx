"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, QrCode, Users } from "lucide-react";
import api from "@/lib/axios";

interface RestaurantData {
  total_customers: number;
  avg_stay_time: number;
  total_messages: number;
  total_qr_scanned: number;
}

export default function DashboardTab() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [averageStayTime, setAverageStayTime] = useState(0);
  const [totalGroupMessages, setTotalGroupMessages] = useState(0);
  const [totalQrCodeScans, setTotalQrCodeScans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Access localStorage only after the component has mounted
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!restaurantId) return;
    try {
      const response = await api.get<RestaurantData>(`/restaurants/${restaurantId}/`);
      setTotalCustomers(response.data.total_customers);
      setAverageStayTime(response.data.avg_stay_time);
      setTotalGroupMessages(response.data.total_messages);
      setTotalQrCodeScans(response.data.total_qr_scanned);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching restaurant data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!restaurantId) {
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
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white dark:from-purple-700 dark:to-indigo-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-zinc-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white dark:from-pink-700 dark:to-rose-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Stay Time</CardTitle>
          <Clock className="h-4 w-4 text-zinc-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${averageStayTime} min`}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white dark:from-cyan-700 dark:to-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chat Group Activity</CardTitle>
          <MessageSquare className="h-4 w-4 text-zinc-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGroupMessages} messages</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white dark:from-emerald-700 dark:to-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">QR Code Scans</CardTitle>
          <QrCode className="h-4 w-4 text-zinc-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQrCodeScans}</div>
        </CardContent>
      </Card>
    </div>
  );
}