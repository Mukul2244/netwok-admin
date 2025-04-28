"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams} from "next/navigation"
import {
  ArrowLeft,
  Clock,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VisitorByDay {
  [key: string]: string | number;  // Add index signature
  day: string;
  count: number;
}

interface VisitorByHour {
  [key: string]: string | number;  // Add index signature
  hour: string;
  count: number;
}

interface ScanHistory {
  [key: string]: string | number;  // Add index signature
  date: string;
  count: number;
}




interface PopularInterest {
  interest: string;
  percentage: number;
}

interface RecentScan {
  id: number;
  user: string;
  time: string;
  interests: string[];
}

interface Venue {
  id: number;
  name: string;
  type: string;
  subscription: string;
  status: string;
  lastQrScanned: string;
  totalScans: number;
  activeVisitors: number;
  totalVisitors: number;
  averageStay: string;
  visitorsByDay: VisitorByDay[];
  visitorsByHour: VisitorByHour[];
  scanHistory: ScanHistory[];
  popularInterests: PopularInterest[];
  recentScans: RecentScan[];
}

export default function VenueUsagePage() {
  const params = useParams()
 
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("week")

  useEffect(() => {
    // Simulating API fetch
    const fetchVenueData = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/pubs/${params.id}`);
        // const data = await response.json();
        
        // For now, we'll use a timeout to simulate network request
        setTimeout(() => {
          const mockVenue = params.id === "1" ? {
            id: 1,
            name: "The Golden Pub",
            type: "Pub & Restaurant",
            subscription: "Professional",
            status: "active",
            lastQrScanned: "2023-06-18T14:32:00Z",
            totalScans: 1245,
            activeVisitors: 24,
            totalVisitors: 3567,
            averageStay: "1h 45m",
            visitorsByDay: [
              { day: "Monday", count: 120 },
              { day: "Tuesday", count: 145 },
              { day: "Wednesday", count: 190 },
              { day: "Thursday", count: 240 },
              { day: "Friday", count: 380 },
              { day: "Saturday", count: 420 },
              { day: "Sunday", count: 280 },
            ],
            visitorsByHour: [
              { hour: "12pm", count: 45 },
              { hour: "1pm", count: 60 },
              { hour: "2pm", count: 75 },
              { hour: "3pm", count: 65 },
              { hour: "4pm", count: 55 },
              { hour: "5pm", count: 85 },
              { hour: "6pm", count: 120 },
              { hour: "7pm", count: 180 },
              { hour: "8pm", count: 210 },
              { hour: "9pm", count: 190 },
              { hour: "10pm", count: 150 },
              { hour: "11pm", count: 90 },
            ],
            scanHistory: [
              { date: "2023-06-18", count: 85 },
              { date: "2023-06-17", count: 92 },
              { date: "2023-06-16", count: 78 },
              { date: "2023-06-15", count: 65 },
              { date: "2023-06-14", count: 70 },
              { date: "2023-06-13", count: 62 },
              { date: "2023-06-12", count: 58 },
            ],
            popularInterests: [
              { interest: "Beer", percentage: 42 },
              { interest: "Music", percentage: 38 },
              { interest: "Sports", percentage: 35 },
              { interest: "Friendship", percentage: 29 },
              { interest: "Flirting", percentage: 24 },
            ],
            recentScans: [
              { id: 1, user: "User #12345", time: "2023-06-18T14:32:00Z", interests: ["Beer", "Music"] },
              { id: 2, user: "User #67890", time: "2023-06-18T14:28:00Z", interests: ["Sports", "Beer"] },
              { id: 3, user: "User #54321", time: "2023-06-18T14:15:00Z", interests: ["Friendship", "Music"] },
              { id: 4, user: "User #98765", time: "2023-06-18T14:05:00Z", interests: ["Flirting", "Beer"] },
              { id: 5, user: "User #24680", time: "2023-06-18T13:58:00Z", interests: ["Sports", "Friendship"] },
            ],
          } : null

          setVenue(mockVenue)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching venue data:", error)
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVenueData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading venue usage data...</p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Venue Not Found</h1>
          <p className="mb-6">The venue you are looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link href="/admin/venues">Back to Venues</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Function to generate placeholder data for when API data isn't available
  const getPlaceholderData = (type:string) => {
    switch (type) {
      case 'visitorsByDay':
        return [
          { day: 'Monday', count: '--' },
          { day: 'Tuesday', count: '--' },
          { day: 'Wednesday', count: '--' },
          { day: 'Thursday', count: '--' },
          { day: 'Friday', count: '--' },
          { day: 'Saturday', count: '--' },
          { day: 'Sunday', count: '--' },
        ];
      case 'visitorsByHour':
        return Array.from({ length: 12 }, (_, i) => ({
          hour: `${i + 12 > 12 ? i : i + 12}${i + 12 > 11 ? 'pm' : 'am'}`,
          count: '--'
        }));
      case 'scanHistory':
        return Array.from({ length: 7 }, (_, i) => ({
          date: `2023-06-${18 - i}`,
          count: '--'
        }));
      case 'popularInterests':
        return [
          { interest: 'Interest 1', percentage: '--' },
          { interest: 'Interest 2', percentage: '--' },
          { interest: 'Interest 3', percentage: '--' },
          { interest: 'Interest 4', percentage: '--' },
          { interest: 'Interest 5', percentage: '--' },
        ];
      case 'recentScans':
        return Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          user: 'User #-----',
          time: 'Waiting for data...',
          interests: ['--', '--']
        }));
      default:
        return [];
    }
  };

  const handleDownload = () => {
    if (!venue) return;
  
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(venue, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${venue.name}_usage_data.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  

  // Use API data if available, otherwise use placeholders
  const visitorsByDay = venue.visitorsByDay || getPlaceholderData('visitorsByDay');
  const visitorsByHour = venue.visitorsByHour || getPlaceholderData('visitorsByHour');
  const scanHistory = venue.scanHistory || getPlaceholderData('scanHistory');
  const popularInterests = venue.popularInterests || getPlaceholderData('popularInterests');
  const recentScans = venue.recentScans || getPlaceholderData('recentScans');

  

  const getMaxValue = (data: { [key: string]: number | string }[], key: string): number => {
    if (!data || data[0][key] === '--') return 100;
  
    // Ensure the value is a number before trying to get the maximum
    return Math.max(...data.map((d) => {
      const value = d[key];
      // Only consider numeric values (ignore if value is a string like '--')
      return typeof value === 'number' ? value : -Infinity;
    }));
  };
  
  

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content - now full width without sidebar */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/venues">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Usage Analytics</h1>
                <p className="text-sm text-muted-foreground">{venue.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownload}>
  <Download className="mr-2 h-4 w-4" />
  Export
</Button>

          </div>
        </header>
        
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          {/* Quick stats cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total QR Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.totalScans ? venue.totalScans.toLocaleString() : '--'}</div>
                <p className="text-xs text-muted-foreground">+12% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.activeVisitors || '--'}</div>
                <p className="text-xs text-muted-foreground">Currently at venue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.totalVisitors ? venue.totalVisitors.toLocaleString() : '--'}</div>
                <p className="text-xs text-muted-foreground">All-time unique visitors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.averageStay || '--'}</div>
                <p className="text-xs text-muted-foreground">Time spent at venue</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts - Visitors by Day and Hour */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Visitors by Day</CardTitle>
                <CardDescription>Number of visitors per day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="space-y-4">
                    {visitorsByDay.map((item: { day: string; count: number | string }) => (
                      <div key={item.day} className="flex items-center">
                        <div className="w-24 text-sm">{item.day}</div>
                        <div className="flex-1">
                          <div className="h-4 rounded-full bg-primary/20 overflow-hidden">
                            {item.count !== '--' && (
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                style={{
                                    width: `${(typeof item.count === 'number' ? (item.count / getMaxValue(visitorsByDay, 'count')) * 100 : 0)}%`,

                                }}
                              ></div>
                            )}
                            {item.count === '--' && (
                              <div className="h-full bg-gray-200 animate-pulse" style={{ width: '30%' }}></div>
                            )}
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm font-medium">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitors by Hour</CardTitle>
                <CardDescription>Number of visitors per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="space-y-4">
                    {visitorsByHour.map((item: { hour: string; count: number | string }) => (
                      <div key={item.hour} className="flex items-center">
                        <div className="w-16 text-sm">{item.hour}</div>
                        <div className="flex-1">
                          <div className="h-4 rounded-full bg-primary/20 overflow-hidden">
                            {item.count !== '--' && (
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                style={{
                                    width: `${(typeof item.count === 'number' ? (item.count / getMaxValue(visitorsByHour, 'count')) * 100 : 0)}%`,

                                }}
                              ></div>
                            )}
                            {item.count === '--' && (
                              <div className="h-full bg-gray-200 animate-pulse" style={{ width: '50%' }}></div>
                            )}
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm font-medium">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Interests and Recent Scans */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Interests</CardTitle>
                <CardDescription>What your visitors are interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularInterests.map((item: { interest: string; percentage: number | string })  => (
                    <div key={item.interest} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {item.interest === "Beer"
                            ? "🍺"
                            : item.interest === "Music"
                              ? "🎵"
                              : item.interest === "Sports"
                                ? "⚽"
                                : item.interest === "Friendship"
                                  ? "🤝"
                                  : item.interest === "Flirting"
                                    ? "😏"
                                    : item.interest === "Beach"
                                      ? "🏖️"
                                      : item.interest === "Cocktails"
                                        ? "🍹"
                                        : item.interest === "Dancing"
                                          ? "💃"
                                          : "❓"}
                        </span>
                        <span>{item.interest}</span>
                      </div>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent QR Scans</CardTitle>
                <CardDescription>Latest visitors who scanned your QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {recentScans.map((scan: { id: number; user: string; time: string; interests: string[] }) => (
 
                    <div
                      key={scan.id}
                      className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{scan.user}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{scan.time === 'Waiting for data...' ? scan.time : new Date(scan.time).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                      {scan.interests.map((interest: string) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Scan History */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scan History</CardTitle>
              <CardDescription>Number of scans per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <div className="grid grid-cols-7 gap-2 h-full">
                {scanHistory.map((item: { date: string; count: number | string }) => (

                    <div key={item.date} className="flex flex-col items-center justify-end">
                      {item.count !== '--' ? (
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-md"
                          style={{
                            height: `${(typeof item.count === 'number' ? (item.count / getMaxValue(scanHistory, 'count')) * 100 : 0)}%`,
                          }}
                        ></div>
                      ) : (
                        <div className="w-full bg-gray-200 animate-pulse rounded-t-md" style={{ height: '40%' }}></div>
                      )}
                      <div className="mt-2 text-xs text-center">
                        <div>{new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })}</div>
                        <div className="font-medium">{item.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}