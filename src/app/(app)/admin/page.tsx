

"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Building, Users, DollarSign, MessageSquare, 
  ArrowUp, ArrowDown, Download, Clock
} from 'lucide-react';
import api from '@/lib/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface PlatformOverview {
  totalVenues: number;
  activeUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  userGrowthRate: number;
  revenueGrowthRate: number;
  venueGrowthRate: number;
  subscriptionGrowthRate: number;
}

interface SignupEntry {
  id: string;
  name: string;
  location: string;
  timeAgo: string;
  initials: string;
}

interface CouponEntry {
  code: string;
  discount: string;
  usageCount: number;
  type: string;
}

interface ActivityEntry {
  event: string;
  timeAgo: string;
}

interface SubscriptionPlan {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export default function OverviewTab() {
  const [platformOverview, setPlatformOverview] = useState<PlatformOverview>({
    totalVenues: 142,
    activeUsers: 2850,
    monthlyRevenue: 12234,
    activeSubscriptions: 136,
    userGrowthRate: 8.4,
    revenueGrowthRate: 4.2,
    venueGrowthRate: 12,
    subscriptionGrowthRate: 5.8
  });
  
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([
    { month: 'Jan', revenue: 6500 },
    { month: 'Feb', revenue: 7200 },
    { month: 'Mar', revenue: 8300 },
    { month: 'Apr', revenue: 9100 },
    { month: 'May', revenue: 10800 },
    { month: 'Jun', revenue: 12234 }
  ]);
  
  const [userGrowthData, setUserGrowthData] = useState<{ month: string; users: number }[]>([
    { month: 'Jan', users: 1450 },
    { month: 'Feb', users: 1680 },
    { month: 'Mar', users: 1950 },
    { month: 'Apr', users: 2250 },
    { month: 'May', users: 2630 },
    { month: 'Jun', users: 2850 }
  ]);

  // Recent signups data
  const [recentSignups, setRecentSignups] = useState<SignupEntry[]>([
    { id: "CP", name: "Central Perk", location: "New York", timeAgo: "2 hours ago", initials: "CP" },
    { id: "TG", name: "The Golden Pub", location: "London", timeAgo: "5 hours ago", initials: "TG" },
    { id: "BH", name: "Blue Horizon", location: "Miami", timeAgo: "1 day ago", initials: "BH" },
    { id: "SC", name: "Sunset Cafe", location: "Los Angeles", timeAgo: "2 days ago", initials: "SC" },
    { id: "RL", name: "Red Lion", location: "Chicago", timeAgo: "3 days ago", initials: "RL" }
  ]);

  // Recent coupons data
  const [recentCoupons, setRecentCoupons] = useState<CouponEntry[]>([
    { code: "SUMMER23", discount: "20% off", usageCount: 12, type: "seasonal" },
    { code: "NEWVENUE", discount: "Free month", usageCount: 8, type: "onboarding" },
    { code: "UPGRADE50", discount: "50% off upgrade", usageCount: 5, type: "upgrade" },
    { code: "REFER10", discount: "10% off", usageCount: 3, type: "referral" }
  ]);

  // Recent activity data
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([
    { event: "New venue registered: The Golden Pub", timeAgo: "10 min ago" },
    { event: "Payment received: $79.00 from Blue Horizon", timeAgo: "1 hour ago" },
    { event: "Subscription upgraded: Sunset Cafe to Professional", timeAgo: "3 hours ago" },
    { event: "New coupon created: SUMMER23", timeAgo: "5 hours ago" },
    { event: "User reported issue with QR code scanning", timeAgo: "1 day ago" }
  ]);

  // Subscription distribution data
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    { name: "Starter", count: 42, percentage: 31, color: "#8b5cf6" },
    { name: "Professional", count: 78, percentage: 57, color: "#ec4899" },
    { name: "Enterprise", count: 16, percentage: 12, color: "#3b82f6" }
  ]);
  
  // Fetch data from the API
  const getData = async () => {
    try {
      const response = await api.get('/superuser/');
      const data = response.data;
      
      // Once API is ready, we'll update the state here
      // For now, we're using mock data
      
      // Example of how we would update the state with real API data:
      // setPlatformOverview({
      //   totalVenues: data.restaurants.total_count || 0,
      //   activeUsers: data.customers.total_count || 0,
      //   monthlyRevenue: data.restaurants.total_revenue || 0,
      //   activeSubscriptions: data.subscriptions.total_count || 0,
      //   userGrowthRate: calculateGrowthRate(data.customers),
      //   revenueGrowthRate: calculateGrowthRate(data.revenue),
      //   venueGrowthRate: calculateGrowthRate(data.restaurants),
      //   subscriptionGrowthRate: calculateGrowthRate(data.subscriptions)
      // });

      // Process revenue data once API is ready
      // if (data.restaurants.monthly_counts && data.restaurants.monthly_counts.length > 0) {
      //   setRevenueData(data.restaurants.monthly_counts.map((item: { month: string; total_revenue: number }) => ({
      //     month: item.month,
      //     revenue: item.total_revenue
      //   })));
      // }

      // Process user data once API is ready
      // if (data.customers.monthly_counts && data.customers.monthly_counts.length > 0) {
      //   setUserGrowthData(data.customers.monthly_counts.map((item: { month: string; count: number }) => ({
      //     month: item.month,
      //     users: item.count
      //   })));
      // }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getData();
    // Later we can add a refresh interval if needed
    // const interval = setInterval(getData, 60000);
    // return () => clearInterval(interval);
  }, []);

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Render growth indicator
  const renderGrowthIndicator = (rate: number) => {
    return rate > 0 ? (
      <div className="flex items-center text-emerald-500 text-xs">
        <ArrowUp className="h-3 w-3 mr-1" />
        {`+${rate}% from last month`}
      </div>
    ) : (
      <div className="flex items-center text-red-500 text-xs">
        <ArrowDown className="h-3 w-3 mr-1" />
        {`${rate}% from last month`}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(platformOverview.totalVenues)}</div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.venueGrowthRate)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(platformOverview.activeUsers)}</div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.userGrowthRate)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformOverview.monthlyRevenue)}</div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.revenueGrowthRate)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(platformOverview.activeSubscriptions)}</div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.subscriptionGrowthRate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Overview, Analytics, Reports */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <p className="text-sm text-muted-foreground">
                  There were 12 new venue signups in the last 7 days
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSignups.map((signup) => (
                    <div key={signup.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          {signup.initials}
                        </div>
                        <div>
                          <p className="font-medium">{signup.name}</p>
                          <p className="text-sm text-muted-foreground">{signup.location}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{signup.timeAgo}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Breakdown of active subscription plans
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: plan.color }}></div>
                          <span>{plan.name}</span>
                        </div>
                        <span className="font-medium">
                          {plan.count} ({plan.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${plan.percentage}%`,
                            backgroundColor: plan.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Coupons */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Coupons</CardTitle>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCoupons.map((coupon) => (
                    <div key={coupon.code} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{coupon.code}</p>
                        <p className="text-sm text-muted-foreground">{coupon.discount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{coupon.usageCount} uses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest system activity logs
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-4 flex h-2 w-2 rounded-full bg-purple-500"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {activity.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">More detailed analytics will be available here soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Reports Dashboard</h3>
            <p className="text-muted-foreground">Custom reports and exports will be available here soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}







