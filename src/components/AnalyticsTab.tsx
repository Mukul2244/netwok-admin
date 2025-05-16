import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area, 
    BarChart, Bar, Legend
  } from 'recharts';
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import {  TabsContent } from "@/components/ui/tabs";
  import { ArrowUpRight, TrendingUp, Activity, BarChart3 } from 'lucide-react';
  
  type AnalyticsItem = {
      month: string;
      revenue: number;
      total_users: number;
      total_messages: number;
      };
  
  
    type TooltipProps = {
      active?: boolean;
      payload?: {
        name: string;
        value: number;
        color: string;
        payload: AnalyticsItem & { fullLabel: string };
      }[];
      label?: string;
    };
      
      type AnalyticsTabProps = {
      analyticsData: AnalyticsItem[];
      };
  const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analyticsData = [] }) => {
  
    // Format month labels for better display
    const formattedData = analyticsData.map(item => {
      const [year, month] = item.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        ...item,
        formattedMonth: date.toLocaleString('default', { month: 'short' }),
        fullLabel: `${date.toLocaleString('default', { month: 'short' })} ${year}`
      };
    });
  
    // Calculate total values for summary cards
    const totalRevenue = formattedData.reduce((acc, item) => acc + item.revenue, 0);
    const totalUsers = formattedData[formattedData.length - 1].total_users;
    const totalMessages = formattedData.reduce((acc, item) => acc + item.total_messages, 0);
    
    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
  
    const lastMonthRevenue = formattedData[formattedData.length - 1].revenue;
    const prevMonthRevenue = formattedData[formattedData.length - 2].revenue;
    const revenueGrowth = calculateGrowth(lastMonthRevenue, prevMonthRevenue);
  
    const lastMonthUsers = formattedData[formattedData.length - 1].total_users;
    const prevMonthUsers = formattedData[formattedData.length - 2].total_users;
    const userGrowth = calculateGrowth(lastMonthUsers, prevMonthUsers);
  
    // Helper function to format currency
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };
    
  
    
    const CustomTooltip = ({ active, payload }: TooltipProps) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="p-3 bg-white border rounded shadow-lg">
            <p className="font-medium text-gray-900">{data.fullLabel}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
    
  
    return (
      <TabsContent value="analytics">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <div className={`flex items-center text-xs ${revenueGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{revenueGrowth.toFixed(0)}% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className={`flex items-center text-xs ${userGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{userGrowth.toFixed(0)}% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMessages}</div>
                <div className="text-xs text-muted-foreground">
                  Across all platforms
                </div>
              </CardContent>
            </Card>
          </div>
  
          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly revenue over time
                </p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b344e3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#b344e3" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="formattedMonth" 
                      tickFormatter={(value, index) => index % 2 === 0 ? value : ''}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`} 
                      domain={[0, 'dataMax + 1000']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      name="Revenue"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#b344e3" 
                      strokeWidth={2}
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
                <p className="text-sm text-muted-foreground">
                  Monthly user acquisition
                </p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="formattedMonth" 
                      tickFormatter={(value, index) => index % 2 === 0 ? value : ''}
                    />
                    <YAxis domain={[0, 'dataMax + 5']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      name="Users"
                      type="monotone" 
                      dataKey="total_users" 
                      stroke="#e344c6"
                      strokeWidth={2}
                      dot={{ fill: '#e344c6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Combined Data Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combined metrics analysis
                </p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="formattedMonth" 
                      tickFormatter={(value, index) => index % 2 === 0 ? value : ''}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      name="Revenue ($)"
                      yAxisId="left" 
                      dataKey="revenue" 
                      fill="#b344e3" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Messages"
                      yAxisId="right" 
                      dataKey="total_messages" 
                      fill="#2999f0" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    );
  };
  
  export default AnalyticsTab;