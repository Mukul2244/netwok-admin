"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Users, Activity, Store, MessageCircle } from "lucide-react"
import api from '@/lib/axios'

interface MonthlyCount {
  month: string;
  count: number;
}

interface DashboardEntity {
  monthly_counts: MonthlyCount[];
  total_count: number;
}

interface RestaurantData extends DashboardEntity {
  total_revenue: number;
}

interface DashboardData {
  customers: DashboardEntity;
  restaurants: RestaurantData;
  private_chatrooms: DashboardEntity;
}


export default function DashboardTab() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    customers: {
      monthly_counts: [],
      total_count: 0
    },
    restaurants: {
      monthly_counts: [],
      total_count: 0,
      total_revenue: 0
    },
    private_chatrooms: {
      monthly_counts: [],
      total_count: 0
    }
  })


  
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('monthly')

  const getData = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/superuser/')
      setDashboardData(response.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // Prepare data for charts
  const prepareChartData = () => {
    // Get all unique months from all data types
    const allMonths = new Set<string>()

    
    dashboardData.customers.monthly_counts.forEach(item => allMonths.add(item.month))
    dashboardData.restaurants.monthly_counts.forEach(item => allMonths.add(item.month))
    dashboardData.private_chatrooms.monthly_counts.forEach(item => allMonths.add(item.month))
    
    // Create a sorted array of months
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.indexOf(a) - months.indexOf(b)
    })
    
    // Create the chart data with all metrics
    return sortedMonths.map(month => {
      const customerData = dashboardData.customers.monthly_counts.find(item => item.month === month)
      const restaurantData = dashboardData.restaurants.monthly_counts.find(item => item.month === month)
      const chatroomData = dashboardData.private_chatrooms.monthly_counts.find(item => item.month === month)
      
     

      return {
        month: month,
        users: customerData ? customerData.count : 0,
        restaurants: restaurantData ? restaurantData.count : 0,
        chatrooms: chatroomData ? chatroomData.count : 0
      }
    })
  }
  console.log(timeframe)
  const chartData = prepareChartData()
  
  // Calculate growth percentages
  const calculateGrowth = (data:MonthlyCount[]) => {
    if (data.length < 2) return 0
    const currentCount = data[data.length - 1].count
    const previousCount = data[data.length - 2].count
    return previousCount ? Math.round(((currentCount - previousCount) / previousCount) * 100) : 0
  }
  
  const customerGrowth = calculateGrowth(dashboardData.customers.monthly_counts)
  const restaurantGrowth = calculateGrowth(dashboardData.restaurants.monthly_counts)
  const chatroomGrowth = calculateGrowth(dashboardData.private_chatrooms.monthly_counts)
  
  // Calculate average revenue per restaurant
  const avgRevenuePerRestaurant = dashboardData.restaurants.total_count > 0 
    ? Math.round(dashboardData.restaurants.total_revenue / dashboardData.restaurants.total_count) 
    : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Platform Overview</CardTitle>
            <CardDescription>Key metrics across users, restaurants, and chatrooms</CardDescription>
          </div>
          <Tabs defaultValue="monthly" className="w-[240px]" onValueChange={setTimeframe}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRestaurants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorChatrooms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "white" }}
                    labelStyle={{ color: "white", fontWeight: "bold" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="users" name="Users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="restaurants" name="Restaurants" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRestaurants)" />
                  <Area type="monotone" dataKey="chatrooms" name="Chatrooms" stroke="#ffc658" fillOpacity={1} fill="url(#colorChatrooms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 p-2 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold">{dashboardData.customers.total_count}</h3>
                      <Badge variant={customerGrowth >= 0 ? "success" : "destructive"} className="ml-2 px-1 py-0">
                        <span className="flex items-center text-xs">
                          {customerGrowth >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(customerGrowth)}%
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 p-2 rounded-full">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Restaurants</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold">{dashboardData.restaurants.total_count}</h3>
                      <Badge variant={restaurantGrowth >= 0 ? "success" : "destructive"} className="ml-2 px-1 py-0">
                        <span className="flex items-center text-xs">
                          {restaurantGrowth >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(restaurantGrowth)}%
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 p-2 rounded-full">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chatrooms</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold">{dashboardData.private_chatrooms.total_count}</h3>
                      <Badge variant={chatroomGrowth >= 0 ? "success" : "destructive"} className="ml-2 px-1 py-0">
                        <span className="flex items-center text-xs">
                          {chatroomGrowth >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(chatroomGrowth)}%
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 p-2 rounded-full">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold">${dashboardData.restaurants.total_revenue.toLocaleString()}</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Restaurant performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "white" }}
                  />
                  <Bar dataKey="restaurants" name="Restaurants" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Restaurant Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue</span>
                  <Badge variant="outline" className="font-mono">${dashboardData.restaurants.total_revenue.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Revenue per Restaurant</span>
                  <Badge variant="outline" className="font-mono">${avgRevenuePerRestaurant.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Restaurant to User Ratio</span>
                  <Badge variant="outline" className="font-mono">
                    1:{Math.round(dashboardData.customers.total_count / Math.max(1, dashboardData.restaurants.total_count))}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Chatroom Analytics</CardTitle>
            <CardDescription>User engagement and communication patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "white" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chatrooms" 
                    name="Chatrooms" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Chatroom Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Chatrooms</span>
                  <Badge variant="outline" className="font-mono">{dashboardData.private_chatrooms.total_count}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Chatrooms per User</span>
                  <Badge variant="outline" className="font-mono">
                    {(dashboardData.private_chatrooms.total_count / Math.max(1, dashboardData.customers.total_count)).toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth Rate</span>
                  <Badge variant={chatroomGrowth >= 0 ? "success" : "destructive"}>
                    {chatroomGrowth >= 0 ? `+${chatroomGrowth}%` : `${chatroomGrowth}%`}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
