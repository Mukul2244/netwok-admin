"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from 'react';
import {
  ArrowLeft,
  Clock,
  Download,
} from "lucide-react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



interface ScanHistory {
  date: string;
  count: number;
}

interface PopularInterest {
  interest: string;
  percentage: number;
}

interface RecentScan {
  id?: number;
  user: string;
  time: string;
  interests: string[];
}

interface Venue {
  id?: number;
  venue_name?: string;
  total_qr_scans: number;
  active_visitors: number;
  total_visitors: number;
  average_stay: string;
  visitors_by_day: Record<string, number>;
  visitors_by_hour: Record<string, number>;
  qr_scan_history: ScanHistory[];
  popular_interests: PopularInterest[];
  recent_qr_scans: RecentScan[];
}

export default function VenueUsagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = use(params);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    // Simulating API fetch
    const fetchVenueData = async () => {
      try {
        const response = await api.get(`/su/venue/${venueId}/usage?period=${timeRange}`);
        const data = response.data;
        
        setVenue(data );
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching venue data:", error);
        // Fallback to example data if API fails
       
        setLoading(false);
      }
    }

    if (venueId) {
      fetchVenueData();
    }
  }, [venueId, timeRange]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading venue usage data...</p>
        </div>
      </div>
    );
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
    );
  }

  const handleDownload = () => {
    if (!venue) return;
  
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(venue, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${venue.venue_name || 'venue'}_usage_data.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  // Convert visitors_by_day object to array for rendering
  const visitorsByDayArray = Object.entries(venue.visitors_by_day || {}).map(
    ([day, count]) => ({ day, count:Number(count) })
  );
  
  // Convert visitors_by_hour object to array for rendering
  const visitorsByHourArray = Object.entries(venue.visitors_by_hour || {}).map(
    ([hour, count]) => ({ hour,count:Number(count) })
  );

  
 
  const formatHour = (hourStr: string) => {
    const hour = parseInt(hourStr);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12} ${suffix}`;
  };
  const timeRangeLabels: Record<string, string> = {
    "1d": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "12m": "Last 12 Months",
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
                <p className="text-sm text-muted-foreground">{venue.venue_name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select time range">
      {timeRangeLabels[timeRange] || "Select time range"}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1d">Last 24 Hours</SelectItem>
    <SelectItem value="7d">Last 7 Days</SelectItem>
    <SelectItem value="30d">Last 30 Days</SelectItem>
    <SelectItem value="12m">Last 12 Months</SelectItem>
  </SelectContent>
</Select>

            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4 text-black dark:text-white" />
              <span className="text-black dark:text-white">Export</span>
            </Button>
          </div>
        </header>
        
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          {/* Quick stats cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Total QR Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.total_qr_scans ? venue.total_qr_scans.toLocaleString() : '--'}</div>
                <p className="text-xs text-muted-foreground">Total number of QR code scans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Active Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.active_visitors || '--'}</div>
                <p className="text-xs text-muted-foreground">Currently at venue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.total_visitors ? venue.total_visitors.toLocaleString() : '--'}</div>
                <p className="text-xs text-muted-foreground">All-time unique visitors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Average Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venue.average_stay || '--'}</div>
                <p className="text-xs text-muted-foreground">Time spent at venue</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts - Visitors by Day and Hour */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Visitors by Day</CardTitle>
                <CardDescription>Number of visitors per day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {visitorsByDayArray.length > 0 ? (
                    <div className="space-y-4">
                      {/* Map days in a specific order to ensure consistency */}
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                        .map(day => {
                          const dayData = visitorsByDayArray.find(d => d.day === day);
                          return {
                            day,
                            count: dayData ? dayData.count : 0
                          };
                        })
                        .map(item => (
                          <div key={item.day} className="flex items-center">
                            <div className="w-24 text-sm">{item.day}</div>
                            <div className="flex-1">
                              <div className="h-4 rounded-full bg-primary/20 overflow-hidden">
                              <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
                              <div
        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded"
        style={{
          width: `${(item.count*5 || 0)}%`,
        }}
      ></div>
</div>

                              </div>
                            </div>
                            <div className="w-16 text-right text-sm font-medium">
                              {item.count || '0'}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No visitor data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Visitors by Hour</CardTitle>
                <CardDescription>Number of visitors per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {visitorsByHourArray.length > 0 ? (
                    <div className="space-y-4">
                      {/* Sort hours chronologically */}
                      {visitorsByHourArray
                        .sort((a, b) => {
                          return a.hour.localeCompare(b.hour);
                        })
                        .map(item => (
                          <div key={item.hour} className="flex items-center">
                           <div className="w-16 text-sm">{formatHour(item.hour)}</div>

                            <div className="flex-1">
                              <div className="h-4 rounded-full bg-primary/20 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                  style={{
                                    width: `${((item.count*5 || 0))}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-16 text-right text-sm font-medium">
                              {item.count || '0'}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No hourly visitor data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Interests and Recent Scans */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Popular Interests</CardTitle>
                <CardDescription>What your visitors are interested in</CardDescription>
              </CardHeader>
              <CardContent>
                {venue.popular_interests && venue.popular_interests.length > 0 ? (
                  <div className="space-y-4">
                    {venue.popular_interests.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {/* Use generic emoji based on index if no specific match */}
                            {getInterestEmoji(item.interest)}
                          </span>
                          <span>{item.interest}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {item.percentage ? `${Math.round(item.percentage)}%` : '0%'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No interest data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Recent QR Scans</CardTitle>
                <CardDescription>Latest visitors who scanned your QR code</CardDescription>
              </CardHeader>
              <CardContent>
                {venue.recent_qr_scans && venue.recent_qr_scans.length > 0 ? (
                  <div className="space-y-4">
                    {venue.recent_qr_scans.map((scan, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium">{scan.user}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(scan.time).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {Array.isArray(scan.interests) && scan.interests.length > 0 ? 
                            scan.interests.map((interest, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            )) : 
                            <Badge variant="outline" className="text-xs">No interests</Badge>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No recent scan data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* QR Code Scan History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">QR Code Scan History</CardTitle>
              <CardDescription>Number of scans per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <div className="grid grid-cols-7 gap-2 h-full">
                  {venue.qr_scan_history && venue.qr_scan_history.length > 0 ? (
                    venue.qr_scan_history
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-end">
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-md"
                            style={{
                              height: `${(item.count*5)}%`,
                              minHeight: item.count > 0 ? '10%' : '0%'
                            }}
                          ></div>
                          <div className="mt-2 text-xs text-center">
                            <div>{formatDate(item.date)}</div>
                            <div className="font-medium">{item.count}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-7 flex items-center justify-center">
                      <p className="text-muted-foreground">No scan history data available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// Helper function to get emoji for interests
function getInterestEmoji(interest: string): string {
  const interestEmojis: Record<string, string> = {
    "Beer": "🍺",
    "Music": "🎵",
    "Sports": "⚽",
    "Friendship": "🤝",
    "Flirting": "😏",
    "Beach": "🏖️",
    "Cocktails": "🍹",
    "Dancing": "💃",
    "Books": "📚",
    "Art": "🎨",
    "Food": "🍽️",
    "Travel": "✈️",
    "Movies": "🎬",
    "Fitness": "💪",
    "Gaming": "🎮",
    "Nature": "🌳",
  };

  return interestEmojis[interest] || "🔍"; // Default to a generic emoji if not found
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}