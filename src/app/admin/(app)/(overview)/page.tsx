"use client";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsTab from "@/components/AnalyticsTab";
import {
  Building,
  Users,
  DollarSign,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

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
  _id: string;
  name: string;
  city: string;
  time: string;
  logo: string;
}

interface CouponEntry {
  token: string;
  description: string;
  redemptions: string;
}

interface ActivityEntry {
  date: string;
  time: string;
  log: string;
}

interface SubscriptionPlan {
  plan: string;
  count: number;
  percentage: number;
}
type AnalyticsItem = {
  month: string;
  revenue: number;
  total_users: number;
  total_messages: number;
};

type AnalyticsResponse = {
  analytics: AnalyticsItem[];
};

export default function OverviewTab() {
  const [platformOverview, setPlatformOverview] = useState<PlatformOverview>({
    totalVenues: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    userGrowthRate: 0,
    revenueGrowthRate: 0,
    venueGrowthRate: 0,
    subscriptionGrowthRate: 0,
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Recent signups data
  const [recentSignups, setRecentSignups] = useState<SignupEntry[]>([]);

  // Recent coupons data
  const [recentCoupons, setRecentCoupons] = useState<CouponEntry[]>([]);

  // Recent activity data
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);

  // Subscription distribution data
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);

  // Fetch data from the API

  const getData = async () => {
    try {
      setIsLoading(true);

      const [res1, res2, res3] = await Promise.all([
        api.get("/su/dashboard/"),
        api.get("/su/dashboard/overview/"),
        api.get("/su/dashboard/analytics/"),
      ]);

      const data = res1.data;
      const data1 = res2.data;
      const data2: AnalyticsResponse = res3.data;

      console.log(data, "overview data");
      console.log(data1, "dash overview data");

      // Platform overview
      setPlatformOverview({
        totalVenues: data.total_venues || 0,
        activeUsers: data.active_users || 0,
        monthlyRevenue: data.monthly_revenue || 0,
        activeSubscriptions: data.active_subscriptions || 0,
        userGrowthRate: data.active_users_delta_pct ?? 0,
        revenueGrowthRate: data.revenue_delta_pct ?? 0,
        venueGrowthRate: data.venues_delta ?? 0,
        subscriptionGrowthRate: data.active_subscriptions_delta ?? 0,
      });

      // Overview data
      setRecentSignups(data1.recent_signups);
      setRecentCoupons(data1.recent_coupons);
      setRecentActivity(data1.recent_activity);
      setSubscriptionPlans(data1.subscription_distribution);

      setAnalyticsData(data2.analytics);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    
  }, []);

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExport = () => {
    if (!recentCoupons || recentCoupons.length === 0) {
      alert("No coupons to export!");
      return;
    }

    // Create CSV headers
    const headers = Object.keys(recentCoupons[0]).join(",") + "\n";

    // Create CSV rows
    const rows = recentCoupons
      .map((coupon) => Object.values(coupon).join(","))
      .join("\n");

    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = "recent-coupons.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-8 h-64">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Loading dashboard data...</p>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Key metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Total Venues</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(platformOverview.totalVenues)}
            </div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.venueGrowthRate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(platformOverview.activeUsers)}
            </div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.userGrowthRate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(platformOverview.monthlyRevenue)}
            </div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.revenueGrowthRate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Active Subscriptions
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(platformOverview.activeSubscriptions)}
            </div>
            <div className="text-xs text-muted-foreground">
              {renderGrowthIndicator(platformOverview.subscriptionGrowthRate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Overview, Analytics, Reports */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-base">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-base">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Signups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Signups</CardTitle>
                <p className="text-sm text-muted-foreground">
                  There were {recentSignups.length} new venue signups in the last 7 days
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                  {recentSignups.length > 0 ? (
                    recentSignups.map((signup) => (
                      <div
                        key={signup.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-medium uppercase">
                            {signup.logo ? (
                              <img
                                src={signup.logo}
                                alt="Profile"
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              <span className="font-bold">
                                {signup.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-medium">{signup.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {signup.city}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {signup.time &&
                            formatDistanceToNow(new Date(signup.time))}{" "}
                          ago
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No recent signups</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Subscription Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Breakdown of active subscription plans
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionPlans.length > 0 ? (
                    subscriptionPlans.map((plan) => {
                      let colorClass = "";
                      if (plan.plan === "starter" || plan.plan === "Starter") {
                        colorClass = "bg-purple-500";
                        plan.plan = "Starter";
                      } else if (
                        plan.plan === "professional" ||
                        plan.plan === "Professional"
                      ) {
                        colorClass = "bg-pink-500";
                        plan.plan = "Professional";
                      } else if (
                        plan.plan === "enterprise" ||
                        plan.plan === "Enterprise"
                      ) {
                        colorClass = "bg-blue-500";
                        plan.plan = "Enterprise";
                      }

                      return (
                        <div key={plan.plan} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full ${colorClass}`}
                              ></div>
                              <span className="text-base">{plan.plan}</span>
                            </div>
                            <span className="font-medium text-base">
                              {plan.count} ({Math.round(plan.percentage)}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${colorClass}`}
                              style={{ width: `${plan.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No subscription data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Coupons */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Coupons</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleExport}
                  disabled={recentCoupons.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                  {recentCoupons.length > 0 ? (
                    recentCoupons.map((coupon) => (
                      <div
                        key={coupon.token}
                        className="flex text-xl font-bold items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{coupon.token}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right flex items-center gap-1">
                          <span>{coupon.description}</span>
                          <span className="mx-1 text-muted-foreground">•</span>
                          <span className="text-foreground">
                            {coupon.redemptions} uses
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No coupons available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest system activity logs
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => {
                      const rawTime = activity.time;
                      const date = new Date(`1970-01-01T${rawTime}Z`);
                      const formattedTime = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <div key={index} className="flex items-start gap-3">
                        {/* Dot */}
                        <div className="mt-1 h-2 w-2 rounded-full bg-purple-500"></div>
                      
                        {/* Text Content */}
                        <div className="flex-1">
                          <p className="text-sm">{activity.log}</p>
                          <div className="text-xs text-muted-foreground flex justify-end">
                            <span>{formattedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <AnalyticsTab analyticsData={analyticsData} />
          )}
        </TabsContent>

        <TabsContent value="reports">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-medium mb-2">Reports Dashboard</h3>
            <p className="text-muted-foreground">
              Custom reports and exports will be available here soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}