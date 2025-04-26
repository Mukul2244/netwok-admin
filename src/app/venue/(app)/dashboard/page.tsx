
"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, MessageSquare, QrCode, Users, TrendingUp, Calendar, 
  DollarSign, Bookmark, User, ShoppingBag, Tag, AlertCircle, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import AnalyticsTab from "../analytics/page";

interface Customer {
  id: number;
  username: string;
  avatar?: string;
  lastVisit: string;
}

interface Offer {
  id: number;
  title: string;
  discount: string;
  validUntil: string;
}

interface RestaurantData {
  avg_stay_time: string;
  customer_token_refresh_frequency: number;
  customers: Customer[];
  customers_usernames: string[];
  date_created: string;
  description: string;
  id: number;
  logo: string | null;
  name: string;
  offers: Offer[];
  owner_username: string;
  qr_gen_frequency_hours: number;
  qr_gen_frequency_text: string;
  require_otp: boolean;
  revenue: number;
  todays_special: string;
  total_customers: number;
  total_messages: number;
  total_qr_scanned: number;
  var_id: string;
  var_id_expiry_time: string;
  var_id_gen_time: string;
}

export default function DashboardTab() {
  const [dashboardData, setDashboardData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([]);
  const [mockOffers, setMockOffers] = useState<Offer[]>([]);

  // Access localStorage only after component mount
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  const generateMockData = (data: RestaurantData) => {
    // Generate mock customers
    console.log(data)
    const mockCustomersList: Customer[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      username: `customer${i+1}`,
      avatar: undefined,
      lastVisit: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()
    }));
    
    // Generate mock offers
    const mockOffersList: Offer[] = [
      { id: 1, title: "Happy Hour", discount: "20% off on all beverages", validUntil: "2025-05-15" },
      { id: 2, title: "Lunch Special", discount: "Buy 1 Get 1 Free", validUntil: "2025-05-10" },
      { id: 3, title: "Weekend Brunch", discount: "15% off on brunch menu", validUntil: "2025-05-31" }
    ];
    
    setMockCustomers(mockCustomersList);
    setMockOffers(mockOffersList);
  };

  const fetchData = useCallback(async () => {
    if (!restaurantId) return;
    try {
      const response = await api.get<RestaurantData>(`/restaurants/${restaurantId}/`);
      setDashboardData(response.data);
      generateMockData(response.data);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching restaurant data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      // For demo purposes, set mock data even on error
      const mockData = {
        avg_stay_time: "01:38:00",
        customer_token_refresh_frequency: 3,
        customers: [],
        customers_usernames: [],
        date_created: "2025-03-06T12:39:41.089399+05:30",
        description: "A fusion of continental and Asian cuisine for food lovers.",
        id: 76,
        logo: null,
        name: "Fusion Flavors",
        offers: [],
        owner_username: "Bohemia",
        qr_gen_frequency_hours: 730,
        qr_gen_frequency_text: "monthly",
        require_otp: false,
        revenue: 22960,
        todays_special: "Thai Green Curry with Jasmine Rice",
        total_customers: 14,
        total_messages: 32,
        total_qr_scanned: 16,
        var_id: "089873",
        var_id_expiry_time: "2025-05-24T08:10:57.138409+05:30",
        var_id_gen_time: "2025-04-23T22:10:57.138409+05:30"
      };
      setDashboardData(mockData);
      generateMockData(mockData);
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchData();
    // Set up polling every 5 minutes
    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time duration
  const formatDuration = (timeString: string) => {
    // Assuming timeString is in format "HH:MM:SS"
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Restaurant not found
          </h1>
          <p className="text-muted-foreground">
            Please ensure you have selected a restaurant to view dashboard data.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
          <h1 className="text-xl font-medium text-foreground">Loading dashboard data...</h1>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground">No data available</h1>
        <p className="text-muted-foreground">Unable to retrieve restaurant metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{dashboardData.name}</h1>
            <p className="mt-1 opacity-90">{dashboardData.description}</p>
            <div className="flex items-center mt-3">
              {/* <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">ID: {dashboardData.var_id}</Badge> */}
              <p className="ml-4 text-sm">
                <span className="opacity-80">Since </span>
                {formatDate(dashboardData.date_created)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">{dashboardData.owner_username}</span>
            </div>
            <p className="text-xs opacity-80">QR Code updates: {dashboardData.qr_gen_frequency_text}</p>
          </div>
        </div>
      </div>

      {/* Today's Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-950 border-none shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-orange-500" />
              Today&apos;s Special
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center h-24">
              <div className="rounded-full bg-orange-400 h-16 w-16 flex items-center justify-center mr-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium">{dashboardData.todays_special}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your special dishes to attract more customers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-950 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">${dashboardData.revenue.toLocaleString()}</div>
              <div className="rounded-full bg-green-100 dark:bg-green-800 p-2">
                <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-300" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total revenue tracked since opening
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white dark:from-purple-700 dark:to-indigo-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-zinc-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.total_customers}</div>
            <div className="mt-2 text-xs">
              <span className="opacity-80">Growing your community</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white dark:from-pink-700 dark:to-rose-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Stay Time</CardTitle>
            <Clock className="h-5 w-5 text-zinc-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatDuration(dashboardData.avg_stay_time)}</div>
            <div className="mt-2 text-xs">
              <span className="opacity-80">Customer engagement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white dark:from-cyan-700 dark:to-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Group Activity</CardTitle>
            <MessageSquare className="h-5 w-5 text-zinc-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.total_messages}</div>
            <div className="mt-2 text-xs">
              <span className="opacity-80">Social interactions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white dark:from-emerald-700 dark:to-green-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Code Scans</CardTitle>
            <QrCode className="h-5 w-5 text-zinc-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.total_qr_scanned}</div>
            <div className="mt-2 text-xs">
              <span className="opacity-80">Customer entries</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-slate-500" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">OTP Verification</p>
                <p className="text-sm text-muted-foreground">Require OTP for customer login</p>
              </div>
              <Badge className={dashboardData.require_otp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {dashboardData.require_otp ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Token Refresh</p>
                <p className="text-sm text-muted-foreground">Security token refreshes</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Every {dashboardData.customer_token_refresh_frequency} days
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Venue ID</p>
                <p className="text-sm text-muted-foreground">Current ID expires</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {formatDate(dashboardData.var_id_expiry_time)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-slate-500" />
              Active Promotions
            </CardTitle>
            <CardDescription>Currently running offers</CardDescription>
          </CardHeader>
          <CardContent>
            {mockOffers.length > 0 ? (
              <div className="space-y-3">
                {mockOffers.map(offer => (
                  <div key={offer.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">{offer.discount}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">
                      Until {formatDate(offer.validUntil)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">No active promotions</p>
                <p className="text-xs text-muted-foreground mt-1">Create offers to attract more customers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-slate-500" />
            Recent Customers
          </CardTitle>
          <CardDescription>Customers who recently visited your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          {mockCustomers.length > 0 ? (
            <div className="space-y-4">
              {mockCustomers.map(customer => (
                <div key={customer.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {customer.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.username}</p>
                      {/* <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p> */}
                    </div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-800">{customer.lastVisit}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No recent customer data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Detailed Analytics</h2>
        <AnalyticsTab />
      </div>
      
      <div className="text-xs text-right text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleTimeString()} • Data refreshes every 5 minutes
      </div>
    </div>
  );
}