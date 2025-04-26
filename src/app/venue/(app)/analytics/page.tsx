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



// "use client";
// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { BarChart2, PieChart, TrendingUp, Users, Calendar } from "lucide-react";

// export default function AnalyticsTab() {
//   const [restaurantId, setRestaurantId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Mock data for the analytics
//   const mockData = {
//     dailyVisitors: [120, 150, 180, 190, 210, 250, 220],
//     topItems: [
//       { name: "Margherita Pizza", sales: 150 },
//       { name: "Spaghetti Carbonara", sales: 120 },
//       { name: "Tiramisu", sales: 90 },
//       { name: "Bruschetta", sales: 85 },
//     ],
//     revenue: {
//       weekly: 12500,
//       monthly: 52000,
//       yearToDate: 320000,
//     }
//   };

//   // Access localStorage only after the component has mounted
//   useEffect(() => {
//     const storedRestaurantId = localStorage.getItem("restaurantId");
//     if (storedRestaurantId) {
//       setRestaurantId(storedRestaurantId);
//     }
    
//     // Simulate data loading
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//   }, []);

//   if (!restaurantId)
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <h1 className="text-2xl font-bold text-foreground mb-2">
//           Restaurant not found
//         </h1>
//         <p className="text-muted-foreground">
//           Please ensure you have selected a restaurant.
//         </p>
//       </div>
//     );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Analytics overview cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard 
//           title="Daily Visitors" 
//           value="250" 
//           trend="+12%" 
//           icon={<Users size={24} />} 
//           trendPositive={true}
//         />
//         <StatsCard 
//           title="Revenue Today" 
//           value="$1,850" 
//           trend="+5%" 
//           icon={<TrendingUp size={24} />} 
//           trendPositive={true}
//         />
//         <StatsCard 
//           title="Reservations" 
//           value="42" 
//           trend="-3%" 
//           icon={<Calendar size={24} />} 
//           trendPositive={false}
//         />
//         <StatsCard 
//           title="Avg. Order Value" 
//           value="$32.50" 
//           trend="+8%" 
//           icon={<BarChart2 size={24} />} 
//           trendPositive={true}
//         />
//       </div>

//       {/* Tabs for different analytics views */}
//       <Tabs defaultValue="overview" className="w-full">
//         <TabsList className="grid grid-cols-3 mb-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="customers">Customers</TabsTrigger>
//           <TabsTrigger value="sales">Sales</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <Card className="shadow-md">
//               <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
//                 <CardTitle>Customer Trends</CardTitle>
//                 <CardDescription className="text-purple-100">
//                   Last 7 days visitor count
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="h-64 w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg">
//                   <BarChart2 className="h-32 w-32 text-purple-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-md">
//               <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//                 <CardTitle>Top Menu Items</CardTitle>
//                 <CardDescription className="text-indigo-100">
//                   Most ordered dishes this week
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="space-y-4">
//                   {mockData.topItems.map((item, index) => (
//                     <div key={index} className="flex justify-between items-center">
//                       <div className="flex items-center gap-2">
//                         <div className="font-semibold text-foreground">{item.name}</div>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="font-medium">{item.sales} orders</div>
//                         <div className="relative w-24 h-2 ml-4 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="absolute top-0 left-0 h-full bg-blue-500"
//                             style={{ width: `${(item.sales / mockData.topItems[0].sales) * 100}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="customers">
//           <Card className="shadow-md">
//             <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
//               <CardTitle>Customer Demographics</CardTitle>
//               <CardDescription className="text-emerald-100">
//                 Breakdown of your customer base
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="h-64 w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg">
//                 <PieChart className="h-32 w-32 text-emerald-400" />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="sales">
//           <Card className="shadow-md">
//             <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
//               <CardTitle>Revenue Analytics</CardTitle>
//               <CardDescription className="text-amber-100">
//                 Financial performance overview
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
//                   <p className="text-sm font-medium text-muted-foreground">Weekly Revenue</p>
//                   <h3 className="text-2xl font-bold mt-1">${mockData.revenue.weekly.toLocaleString()}</h3>
//                 </div>
//                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
//                   <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
//                   <h3 className="text-2xl font-bold mt-1">${mockData.revenue.monthly.toLocaleString()}</h3>
//                 </div>
//                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
//                   <p className="text-sm font-medium text-muted-foreground">Year to Date</p>
//                   <h3 className="text-2xl font-bold mt-1">${mockData.revenue.yearToDate.toLocaleString()}</h3>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // Reusable stat card component
// function StatsCard({ title, value, trend, icon, trendPositive }) {
//   return (
//     <Card className="shadow-sm">
//       <CardContent className="flex items-center justify-between p-6">
//         <div className="space-y-1">
//           <p className="text-sm font-medium text-muted-foreground">{title}</p>
//           <h3 className="text-2xl font-bold">{value}</h3>
//           <p className={`text-xs flex items-center ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
//             {trend}
//             <span className="ml-1">vs last week</span>
//           </p>
//         </div>
//         <div className="p-2 bg-muted rounded-full">
//           {icon}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

