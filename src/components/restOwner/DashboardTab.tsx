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

  const restaurantId = localStorage.getItem("restaurantId");

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
      <div>
        <h1>Restaurant not found</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }



  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-purple-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          {/* <p className="text-xs text-purple-200">+20.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Stay Time</CardTitle>
          <Clock className="h-4 w-4 text-pink-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${averageStayTime} min`}</div>
          {/* <p className="text-xs text-pink-200">+5% from last month</p> */}
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chat Group Activity</CardTitle>
          <MessageSquare className="h-4 w-4 text-cyan-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGroupMessages} messages</div>
          {/* <p className="text-xs text-cyan-200">+12% since yesterday</p> */}
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">QR Code Scans</CardTitle>
          <QrCode className="h-4 w-4 text-emerald-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQrCodeScans}</div>
          {/* <p className="text-xs text-emerald-200">+201 from last week</p> */}
        </CardContent>
      </Card>
    </div>
  );
}

