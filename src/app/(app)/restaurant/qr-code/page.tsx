"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Copy, Download, RefreshCw, Settings2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Timer from "@/components/Timer";

type sizeMap = {
  small: 100;
  medium: 200;
  large: 300;
};

type QrSize = keyof sizeMap;

export default function RestaurantQRCodePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"display" | "customize">(
    "display"
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to our Restaurant!"
  );
  const [specialOffer, setSpecialOffer] = useState(
    "10% off your first order when you sign up today!"
  );
  const [showLogo, setShowLogo] = useState(true);
  const [showOffer, setShowOffer] = useState(true);
  const [qrSize, setQrSize] = useState<QrSize>("medium");
  const qrRef = useRef<SVGSVGElement | null>(null);

  // Restaurant data state
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [logo, setLogo] = useState("");
  const [qrCodeNumber, setQrCodeNumber] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  // Mock data for analytics
  const analytics = {
    totalScans: 247,
    signUps: 183,
    todayScans: 24,
    conversionRate: "74%",
    scanActivity: [38, 36, 42, 48, 40, 44, 50],
    recentSignups: [
      {
        id: "ET",
        name: "Emma Thompson",
        table: "Table 7",
        time: "5 minutes ago",
      },
      {
        id: "MC",
        name: "Michael Chen",
        table: "Table 3",
        time: "15 minutes ago",
      },
      {
        id: "SR",
        name: "Sophia Rodriguez",
        table: "Bar",
        time: "32 minutes ago",
      },
      { id: "JW", name: "James Wilson", table: "Table 12", time: "1 hour ago" },
    ],
  };

  // Access localStorage only after the component has mounted
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  // Fetch restaurant data when restaurantId is available
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!restaurantId) return;
        const response = await api.get(`/restaurants/${restaurantId}/`);
        setRestaurantName(response.data.name);
        setLogo(response.data.logo);
        setQrCodeNumber(response.data.var_id);
        setExpiryTime(response.data.var_id_expiry_time);
        setRedirectUrl(
          `https://users.netwok.app/register?restaurantId=${restaurantId}&qrCodeNumber=${response.data.var_id}`
        );

        // Set welcome message based on restaurant name
        // setWelcomeMessage(`Welcome to ${response.data.name}!`);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast("Failed to load restaurant data");
      }
    };
    fetchData();
  }, [restaurantId]);

  const backToDash = () => {
    router.push("/restaurant");
  };

  const handleTabChange = (value: string) => {
    if (value === "display" || value === "customize") {
      setActiveTab(value);
    }
  };

  // Function to generate new QR code
  const generateQRCode = async () => {
    try {
      if (!restaurantId) return;
      const response = await api.post("/api/trigger-var-id-update/", {
        restaurant_id: restaurantId,
      });
      setQrCodeNumber(response.data.restaurant.var_id);
      localStorage.setItem("qrCodeNumber", response.data.restaurant.var_id);
      setExpiryTime(response.data.restaurant.var_id_expiry_time);
      setRedirectUrl(
        `https://users.netwok.app/register?restaurantId=${restaurantId}&qrCodeNumber=${response.data.restaurant.var_id}`
      );
      toast("QR code changed successfully");
    } catch (error) {
      console.error("Error generating new QR code:", error);
      toast(
        "Something went wrong while changing the QR code. Please try again after some time."
      );
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      const imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      a.setAttribute("download", "restaurant-qr-code.png");
      a.setAttribute("href", imgURI);
      a.click();
    };

    image.src = url;
  };

  // Apply changes to QR code appearance
  const applyChanges = () => {
    toast("Changes applied successfully");
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(redirectUrl);
    toast("URL copied to clipboard");
  };

  // QR code size mapping
  const sizeMap = {
    small: 140,
    medium: 180,
    large: 240,
  };

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
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={backToDash}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Restaurant QR Code</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="display">Display QR</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Your Restaurant QR Code</CardTitle>
                  <CardDescription>
                    Display this QR code in your restaurant for customers to
                    scan and sign up
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="text-center mb-4">
                    Welcome to {restaurantName}!
                    {showOffer && (
                      <div className="text-sm text-gray-600 mt-1">
                        {specialOffer}
                      </div>
                    )}
                  </div>
                  <div className="border p-6 rounded-lg mb-4">
                  
                    <QRCodeSVG
                      ref={qrRef}
                      value={redirectUrl}
                      size={sizeMap[qrSize]}
                      level="H"
                      includeMargin={true}
                      imageSettings={
                        showLogo
                          ? {
                              src: logo || "/api/placeholder/48/48",
                              excavate: true,
                              height: 24,
                              width: 24,
                            }
                          : undefined
                      }
                    />
                  </div>
                  <div className="text-3xl font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                    {qrCodeNumber}
                  </div>
                  <div className="text-xl mb-4 text-zinc-600 dark:text-zinc-400">
                    Time until reset:{" "}
                    <Timer
                      key={expiryTime}
                      expiryDate={expiryTime}
                      onExpire={generateQRCode}
                    />
                  </div>
                  <div className="w-full text-center">
                    <p className="text-sm text-gray-500">
                      Scan to connect with us!
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                      <span>or visit: </span>
                      <span className="ml-1 text-blue-600">{redirectUrl}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="flex items-center text-sm px-0.5"
                    onClick={downloadQRCode}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center text-sm px-0.5"
                    onClick={generateQRCode}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center text-sm px-0.5"
                    onClick={() => setActiveTab("customize")}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Learn how to use your QR code effectively
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="space-y-1">
                      <div className="font-medium">1. Place your QR code</div>
                      <div className="text-sm text-gray-500">
                        Display it on tables, at the entrance, or on menus where
                        customers can easily see it.
                      </div>
                    </li>
                    <li className="space-y-1">
                      <div className="font-medium">
                        2. Customers scan the code
                      </div>
                      <div className="text-sm text-gray-500">
                        When scanned, customers are directed to your sign-up
                        page.
                      </div>
                    </li>
                    <li className="space-y-1">
                      <div className="font-medium">3. Customers sign up</div>
                      <div className="text-sm text-gray-500">
                        They create an account and can immediately start
                        chatting with your staff.
                      </div>
                    </li>
                    <li className="space-y-1">
                      <div className="font-medium">
                        4. Connect with customers
                      </div>
                      <div className="text-sm text-gray-500">
                        Respond to messages, provide information, and enhance
                        their dining experience.
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customize" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your QR Code</CardTitle>
                  <CardDescription>
                    Personalize how your QR code looks and what information it
                    displays
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Input
                      id="welcome-message"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-logo">Show Restaurant Logo</Label>
                      <p className="text-sm text-gray-500">
                        Display your logo in the center of the QR code
                      </p>
                    </div>
                    <Switch
                      id="show-logo"
                      checked={showLogo}
                      onCheckedChange={setShowLogo}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-size">QR Code Size</Label>
                    <Select
                      value={qrSize}
                      onValueChange={(value) => setQrSize(value as QrSize)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="special-offer">Special Offer</Label>
                      <p className="text-sm text-gray-500">
                        Show a special offer to encourage sign-ups
                      </p>
                    </div>
                    <Switch
                      id="special-offer"
                      checked={showOffer}
                      onCheckedChange={setShowOffer}
                    />
                  </div>

                  {showOffer && (
                    <div className="space-y-2">
                      <Input
                        value={specialOffer}
                        onChange={(e) => setSpecialOffer(e.target.value)}
                      />
                    </div>
                  )}

                  <Button
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    onClick={applyChanges}
                  >
                    Apply Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>QR Code Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for your QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redirect-url">Redirect URL</Label>
                    <div className="flex">
                      <Input
                        id="redirect-url"
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This is the URL customers will be directed to when they
                      scan your QR code
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-reset">QR Code Regeneration</Label>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p>Reset your QR code for security reasons</p>
                        <p className="text-xs">
                          Current code expires in:{" "}
                          <Timer
                            key={expiryTime}
                            expiryDate={expiryTime}
                            onExpire={generateQRCode}
                          />
                        </p>
                      </div>
                      <Button variant="outline" onClick={generateQRCode}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Analytics</CardTitle>
              <CardDescription>
                Track how customers are interacting with your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Total Scans</p>
                  <h3 className="text-2xl font-bold">{analytics.totalScans}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sign-ups</p>
                  <h3 className="text-2xl font-bold">{analytics.signUps}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <h3 className="text-2xl font-bold">{analytics.todayScans}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <h3 className="text-2xl font-bold">
                    {analytics.conversionRate}
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-4">
                  Scan Activity (Last 7 Days)
                </h4>
                <div className="flex items-end h-32 gap-2">
                  {analytics.scanActivity.map((value, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 w-full rounded-sm"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Sign-ups</CardTitle>
              <CardDescription>
                People who recently signed up via your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentSignups.map((signup) => (
                  <div
                    key={signup.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                        {signup.id}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{signup.name}</p>
                        <p className="text-sm text-gray-500">{signup.table}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{signup.time}</div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-gray-500">
                View All Sign-ups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
