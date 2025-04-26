"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Building,
  MapPin,
  Calendar,
  QrCode,
  Plus,
  Eye,
  Edit,
  BarChart,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
 
} from "@/components/ui/dropdown-menu";


// interface Venue {
//   id: string;
//   name: string;
//   address: string;
//   subscription: "Starter" | "Professional" | "Enterprise";
//   lastPayment: string;
//   lastScanned: string;
//   status: "Active" | "Inactive";
// }

const venues=[
  {
    id: "1",
    name: "The Golden Pub",
    address: "123 Main St, London, UK",
    subscription: "Professional",
    lastPayment: "15/06/2023",
    lastScanned: "18/06/2023, 20:02:00",
    status: "Active",
  },
  {
    id: "2",
    name: "Blue Horizon",
    address: "456 Ocean Dr, Miami, FL",
    subscription: "Enterprise",
    lastPayment: "10/06/2023",
    lastScanned: "18/06/2023, 01:15:00",
    status: "Active",
  },
  {
    id: "3",
    name: "Sunset Cafe",
    address: "789 Sunset Blvd, Los Angeles, CA",
    subscription: "Professional",
    lastPayment: "05/06/2023",
    lastScanned: "18/06/2023, 17:45:00",
    status: "Active",
  },
  {
    id: "4",
    name: "Central Perk",
    address: "90 Bedford St, New York, NY",
    subscription: "Starter",
    lastPayment: "01/06/2023",
    lastScanned: "16/06/2023, 14:52:00",
    status: "Active",
  },
  {
    id: "5",
    name: "Red Lion",
    address: "567 State St, Chicago, IL",
    subscription: "Starter",
    lastPayment: "28/05/2023",
    lastScanned: "30/05/2023, 22:18:00",
    status: "Inactive",
  },
  {
    id: "6",
    name: "The Prancing Pony",
    address: "1 Bree Rd, Middle Earth",
    subscription: "Professional",
    lastPayment: "25/05/2023",
    lastScanned: "18/06/2023, 13:40:00",
    status: "Active",
  },
  {
    id: "7",
    name: "Moe's Tavern",
    address: "123 Springfield Ave, Springfield",
    subscription: "Starter",
    lastPayment: "20/05/2023",
    lastScanned: "23/05/2023, 02:03:00",
    status: "Inactive",
  },
  {
    id: "8",
    name: "The Three Broomsticks",
    address: "Hogsmeade Village, Scotland",
    subscription: "Enterprise",
    lastPayment: "15/05/2023",
    lastScanned: "17/06/2023, 20:57:00",
    status: "Active",
  },
]

export default function PubsTab() {
  // const [venues, setVenues] = useState<Venue[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Venues");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
 

  // Fetch data from the API
  const fetchVenues = async () => {
    try {
      // const response = await api.get("/superuser/pubsdata/");
      // Once API is ready, uncomment this to use real data
      // setVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues data:", error);
      // Keep using the mock data if API fails
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

 

  // Filter venues based on search query and filters
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Venues" ||
      (statusFilter === "Active Venues" && venue.status === "Active") ||
      (statusFilter === "Inactive Venues" && venue.status === "Inactive");

    const matchesSubscription =
      !subscriptionFilter || venue.subscription === subscriptionFilter;

    return matchesSearch && matchesStatus && matchesSubscription;
  });

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("All Venues");
    setSubscriptionFilter("");
  };

  // Render subscription badge with appropriate color
  const renderSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "Professional":
        return (
          <Badge className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700">
            {subscription}
          </Badge>
        );
      case "Enterprise":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            {subscription}
          </Badge>
        );
      case "Starter":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700">
            {subscription}
          </Badge>
        );
      default:
        return <Badge>{subscription}</Badge>;
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
        {status}
      </Badge>
    ) : (
      <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Venues</h1>
          <p className="text-muted-foreground">
            Manage all registered venues in the system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
            asChild
          >
            <Link href="/admin/pubs/new">
              <Plus className="mr-2 h-4 w-4" />
              New Venue
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            className="pl-8 bg-white dark:bg-gray-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {(statusFilter !== "All Venues" || subscriptionFilter) && (
                <Badge variant="outline" className="ml-1 px-1 py-0 h-5">
                  {statusFilter !== "All Venues" && subscriptionFilter
                    ? "2"
                    : "1"}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>

            {/* Status filter options */}
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <DropdownMenuRadioItem
                value="All Venues"
                className="cursor-pointer"
              >
                {statusFilter === "All Venues" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                All Venues
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Active Venues"
                className="cursor-pointer"
              >
                {statusFilter === "Active Venues" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                Active Venues
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Inactive Venues"
                className="cursor-pointer"
              >
                {statusFilter === "Inactive Venues" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                Inactive Venues
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Subscription</DropdownMenuLabel>

            {/* Subscription filter options */}
            <DropdownMenuRadioGroup
              value={subscriptionFilter}
              onValueChange={setSubscriptionFilter}
            >
              <DropdownMenuRadioItem value="" className="cursor-pointer">
                {subscriptionFilter === "" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                All
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Starter" className="cursor-pointer">
                {subscriptionFilter === "Starter" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                Starter
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Professional"
                className="cursor-pointer"
              >
                {subscriptionFilter === "Professional" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                Professional
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Enterprise"
                className="cursor-pointer"
              >
                {subscriptionFilter === "Enterprise" && (
                  <Check className="h-4 w-4 mr-1" />
                )}{" "}
                Enterprise
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            {/* Show reset button if any filter is applied */}
            {(statusFilter !== "All Venues" || subscriptionFilter) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={resetFilters}
                  className="cursor-pointer text-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                >
                  Reset filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-950 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:border-gray-800">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Address</TableHead>
              <TableHead className="font-medium">Subscription</TableHead>
              <TableHead className="font-medium">Last Payment</TableHead>
              <TableHead className="font-medium">Last QR Scanned</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVenues.length === 0 ? (
              <TableRow className="dark:border-gray-950">
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building className="h-12 w-12 mb-2 opacity-30" />
                    <p>No venues found</p>
                    <p className="text-sm">
                      {searchQuery ||
                      statusFilter !== "All Venues" ||
                      subscriptionFilter
                        ? "Try adjusting your search or filters"
                        : "No venues are available in the system"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVenues.map((venue) => (
                <TableRow
                  key={venue.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-800"
                >
                  <TableCell className="font-medium">{venue.name}</TableCell>
                  <TableCell className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {venue.address}
                  </TableCell>
                  <TableCell>
                    {renderSubscriptionBadge(venue.subscription)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {venue.lastPayment}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      {venue.lastScanned}
                    </div>
                  </TableCell>
                  <TableCell>{renderStatusBadge(venue.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <Link href={`/admin/pubs/${venue.id}`}>
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center gap-2"
                          
                        >
                          <Edit className="h-4 w-4" /> 
                          <Link href={`/admin/pubs/editVenue/${venue.id}`}>Edit Venue</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          <Link href={`/admin/pubs/${venue.id}/usage`}>
                            View usage
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={`cursor-pointer flex items-center gap-2 ${
                            venue.status === "Active"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {venue.status === "Active" ? (
                            <>
                              <AlertTriangle className="h-4 w-4" />
                              Disable venue
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Enable venue
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    
    </div>
  );
}
