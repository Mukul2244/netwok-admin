"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users, Store } from 'lucide-react'
import api from '@/lib/axios'

interface PlatformOverview {
  totalPubs: number
  totalUsers: number
  totalRevenue: number
  activeChats: number
}


interface MonthlyCount {
  month: string;
  revenue: number;
}

// interface RevenueDataItem {
//   month: string
//   revenue: number
// }


export default function RevenueTab() {
  const [platformOverview, setPlatformOverview] = useState<PlatformOverview>({
    totalPubs: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeChats: 0,
  })
  
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
  ])
  
  const [isLoading, setIsLoading] = useState(true)
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(0)
  
  console.log(isLoading)
  const calculateGrowthRate = (data:MonthlyCount[]) => {
    if (data.length < 2) return 0
    const lastMonth = data[data.length - 1].revenue
    const previousMonth = data[data.length - 2].revenue
    if (previousMonth === 0) return 0
    return ((lastMonth - previousMonth) / previousMonth) * 100
  }
  
  const formatCurrency = (value: number): string => {
   
 
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/superuser/')
      const data = response.data
      setPlatformOverview({
        totalPubs: data.restaurants.total_count || 0,
        totalUsers: data.customers.total_count || 0,
        totalRevenue: data.restaurants.total_revenue || 0,
        activeChats: data.private_chatrooms.total_count || 0
      })
      
      const revenueData = data.restaurants.monthly_counts
      if (revenueData.length > 0) {
        const formattedData = revenueData.map((item: { month: string; total_revenue: number }) => ({
          month: item.month,
          revenue: item.total_revenue
        }))
        setRevenueData(formattedData)
        setMonthlyGrowthRate(calculateGrowthRate(formattedData))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  useEffect(() => {
    getData()
  },[getData])

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE']

  // Distribution data for pie chart
  const distributionData = [
    { name: 'Food & Drinks', value: platformOverview.totalRevenue * 0.68 },
    { name: 'Reservations', value: platformOverview.totalRevenue * 0.17 },
    { name: 'Service Fees', value: platformOverview.totalRevenue * 0.15 }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(platformOverview.totalRevenue)}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {monthlyGrowthRate >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${monthlyGrowthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthlyGrowthRate.toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pubs</p>
                <h3 className="text-2xl font-bold mt-1">{platformOverview.totalPubs}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Avg. Revenue: {formatCurrency(platformOverview.totalPubs === 0 ? 0 : 
                Math.round(platformOverview.totalRevenue / platformOverview.totalPubs))}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{platformOverview.totalUsers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Avg. Spend: {formatCurrency(platformOverview.totalUsers === 0 ? 0 : 
                Math.round(platformOverview.totalRevenue / platformOverview.totalUsers))}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Chats</p>
                <h3 className="text-2xl font-bold mt-1">{platformOverview.activeChats}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Engagement metric
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Distribution by revenue source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />

                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4">
                {distributionData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-1" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monthly Revenue Comparison</CardTitle>
          <CardDescription>Bar chart visualization of monthly revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} 
                  cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
