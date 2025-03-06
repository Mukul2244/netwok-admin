"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw } from "lucide-react";
import Timer from "@/components/Timer";
import { QRCodeSVG } from "qrcode.react";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function QrCodeTab() {
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [logo, setLogo] = useState("");
  const [qrCodeNumber, setQrCodeNumber] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const restaurantId = localStorage.getItem("restaurantId")
  const fetchData = async () => {
    try {
      if (!restaurantId) return
      const response = await api.get(`/restaurants/${restaurantId}/`)
      setRestaurantName(response.data.name);
      setLogo(response.data.logo);
      setQrCodeNumber(response.data.var_id);
      setExpiryTime(response.data.var_id_expiry_time);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateQRCode = async () => {
    try {
      if (!restaurantId) return
      const response = await api.post("/api/trigger-var-id-update/", {
        restaurant_id: restaurantId,
      });
      setQrCodeNumber(response.data.restaurant.var_id);
      setExpiryTime(response.data.restaurant.var_id_expiry_time);
      toast("QR code changed successfully");
    } catch (error) {
      console.error("Error generating new QR code:", error);
      toast("Something went wrong while changing the QR code. Please try again after some time.");
    }
  };
  if (!restaurantId) return (
    <div>
      <h1>Restaurant not found</h1>
    </div>
  )
  return (
    <Card className="col-span-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <CardTitle>QR Code Display</CardTitle>
        <CardDescription className="text-emerald-100">
          For customers to scan and join the chat app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="flex justify-center flex-col items-center ">
          <div className="flex items-center justify-center w-64 h-64 bg-white rounded-lg shadow-lg mb-6">
            <QRCodeSVG
              value={`pub-network-customer.vercel.app/register?restaurantId=${restaurantId}&qrCodeNumber=${qrCodeNumber}`}
              className="w-48 h-48 text-emerald-500"
            />
          </div>
          <div className="text-5xl font-bold mb-4 text-emerald-700">
            {qrCodeNumber}
          </div>
          <div className="text-2xl mb-6 text-emerald-600">
            Time until reset: <Timer key={expiryTime} expiryDate={expiryTime} />
          </div>
          <div className="flex items-center space-x-6 bg-white p-4 rounded-lg shadow-md">
            <Avatar className="h-20 w-20 border-4 border-emerald-200">
              <AvatarImage src={logo} alt={restaurantName} />
              <AvatarFallback>{restaurantName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-2xl font-semibold text-emerald-800">
              {restaurantName}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-emerald-100 to-green-100 p-6">
        <Button
          onClick={generateQRCode}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Generate New QR Code
        </Button>
      </CardFooter>
    </Card>
  );
}
