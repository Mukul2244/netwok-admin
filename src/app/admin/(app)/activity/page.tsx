"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for activity logs
const activityLogs = [
  {
    id: 1,
    action: "Venue created",
    details: "New venue 'The Golden Pub' was created",
    user: "admin@netwok.com",
    timestamp: "2023-06-20T14:30:00Z",
    category: "venue",
  },
  {
    id: 2,
    action: "Payment received",
    details: "Payment of $79.00 received from 'Blue Horizon'",
    user: "system",
    timestamp: "2023-06-20T12:15:00Z",
    category: "payment",
  },
  {
    id: 3,
    action: "Subscription upgraded",
    details: "Sunset Cafe upgraded from Starter to Professional plan",
    user: "admin@netwok.com",
    timestamp: "2023-06-19T16:45:00Z",
    category: "subscription",
  },
  {
    id: 4,
    action: "Coupon created",
    details: "New coupon 'SUMMER23' created with 20% discount",
    user: "admin@netwok.com",
    timestamp: "2023-06-19T11:20:00Z",
    category: "coupon",
  },
  {
    id: 5,
    action: "User login",
    details: "Admin user logged in from 192.168.1.1",
    user: "admin@netwok.com",
    timestamp: "2025-04-22T09:05:00Z",
    category: "user",
  },
  {
    id: 6,
    action: "Venue disabled",
    details: "Venue 'Moe's Tavern' was disabled",
    user: "admin@netwok.com",
    timestamp: "2023-06-18T15:30:00Z",
    category: "venue",
  },
  {
    id: 7,
    action: "Support ticket created",
    details: "New support ticket #1234 from 'Central Perk'",
    user: "john@centralperk.com",
    timestamp: "2023-06-18T10:15:00Z",
    category: "support",
  },
  {
    id: 8,
    action: "QR code generated",
    details: "New QR code generated for 'The Three Broomsticks'",
    user: "system",
    timestamp: "2023-06-17T14:45:00Z",
    category: "venue",
  },
  {
    id: 9,
    action: "Payment failed",
    details: "Payment of $29.00 failed for 'Red Lion'",
    user: "system",
    timestamp: "2023-06-17T09:30:00Z",
    category: "payment",
  },
  {
    id: 10,
    action: "System update",
    details: "System updated to version 2.1.0",
    user: "system",
    timestamp: "2023-06-16T22:00:00Z",
    category: "system",
  },
];

// Get unique categories from logs
const categories = Array.from(new Set(activityLogs.map((log) => log.category)));

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  // Calculate date ranges
  const getDateRange = (range: string) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const startDate = new Date(today);

    switch (range) {
      case "today":
        startDate.setHours(0, 0, 0, 0); // Beginning of today
        break;
      case "last7days":
        startDate.setDate(today.getDate() - 7);
        break;
      case "last30days":
        startDate.setDate(today.getDate() - 30);
        break;
      default:
        return null;
    }

    return { start: startDate, end: today };
  };

  // Filter activity logs based on search, category, and date
  const filteredLogs = activityLogs.filter((log) => {
    // Text search filter
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryFilter === null ||
      categoryFilter === "all" ||
      log.category === categoryFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== null) {
      const dateRange = getDateRange(dateFilter);
      if (dateRange) {
        const logDate = new Date(log.timestamp);
        matchesDate = logDate >= dateRange.start && logDate <= dateRange.end;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "venue":
        return "border-purple-500 text-purple-500";
      case "payment":
        return "border-green-500 text-green-500";
      case "subscription":
        return "border-pink-500 text-pink-500";
      case "user":
        return "border-blue-500 text-blue-500";
      case "system":
        return "border-orange-500 text-orange-500";
      case "coupon":
        return "border-yellow-500 text-yellow-500";
      case "support":
        return "border-indigo-500 text-indigo-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter(null);
    setDateFilter(null);
  };

  const exportLogs = () => {
    // Define CSV headers
    const headers = [
      "ID",
      "Action",
      "Details",
      "User",
      "Timestamp",
      "Category",
    ];

    // Map logs to CSV rows
    const rows = filteredLogs.map((log) => [
      log.id,
      `"${log.action}"`, 
      `"${log.details}"`,
      log.user,
      log.timestamp,
      log.category,
    ]);

    // Join everything into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob from the CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "activity_logs.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-1.5">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Activity Log</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </header>
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>
                View all system activities and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activity logs..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Category Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            categoryFilter
                              ? "bg-purple-50 dark:bg-purple-950"
                              : ""
                          }
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          {categoryFilter
                            ? `Category: ${categoryFilter}`
                            : "Filter by Category"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          Filter by Category
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setCategoryFilter("all")}
                        >
                          All Categories
                        </DropdownMenuItem>
                        {categories.map((category) => (
                          <DropdownMenuItem
                            key={category}
                            onClick={() => setCategoryFilter(category)}
                            className={
                              categoryFilter === category ? "bg-purple-500" : ""
                            }
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Date Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            dateFilter ? "bg-blue-50 dark:bg-blue-950" : ""
                          }
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateFilter === "today"
                            ? "Today"
                            : dateFilter === "last7days"
                            ? "Last 7 days"
                            : dateFilter === "last30days"
                            ? "Last 30 days"
                            : "Filter by Date"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDateFilter("today")}
                        >
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDateFilter("last7days")}
                        >
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDateFilter("last30days")}
                        >
                          Last 30 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button - Only show when filters are active */}
                    {(searchQuery || categoryFilter || dateFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-50"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>

                {/* Active filters display */}
                {(categoryFilter || dateFilter) && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {categoryFilter && categoryFilter !== "all" && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 px-3"
                      >
                        Category: {categoryFilter}
                        <button
                          onClick={() => setCategoryFilter(null)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          ✕
                        </button>
                      </Badge>
                    )}
                    {dateFilter && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 px-3"
                      >
                        Date:{" "}
                        {dateFilter === "today"
                          ? "Today"
                          : dateFilter === "last7days"
                          ? "Last 7 days"
                          : "Last 30 days"}
                        <button
                          onClick={() => setDateFilter(null)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          ✕
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {activityLogs.length} logs
                </div>

                {/* No results message */}
                {filteredLogs.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No logs match your current filters.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-none flex flex-col items-center justify-center sm:w-32 gap-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(log.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <div className="font-medium">{log.action}</div>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(log.category)}
                          >
                            {log.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{log.details}</p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          By: {log.user}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredLogs.length > 0 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
