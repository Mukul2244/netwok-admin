"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {toast} from "sonner"
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
import api from "@/lib/axios";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Building,
  MapPin,
  Calendar,
  QrCode,
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


interface Venue {
  id: string;
  name: string;
  address: string;
  subscription: "Starter" | "Professional" | "Enterprise";
  last_payment_date: string;
  last_qr_scanned: string;
  status: boolean;
}



export default function PubsTab() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Venues");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
 

  // Fetch data from the API
  const fetchVenues = async () => {
    try {
      const response = await api.get("/su/venue/details/");
      console.log(response.data,"------------")
      setVenues(response.data);
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
      (statusFilter === "Active Venues" && venue.status === true) ||
      (statusFilter === "Inactive Venues" && venue.status === false);
    
    const matchesSubscription =
      !subscriptionFilter || venue.subscription === subscriptionFilter.toLowerCase();
     console.log(venue.subscription,subscriptionFilter,"ssssssssssssssssss")
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("All Venues");
    setSubscriptionFilter("");
  };


  const handleVenueStatus=async(venueId:string,status:boolean)=>{
    try {
      if (status) {
        // Call disable API
        const res=await api.post(`/su/venue/${venueId}/disable/`)

        toast(`${res.data.detail}`)
        console.log(`Venue ${venueId} disabled`)
      } else {
        // Call enable API
        const res=await api.post(`/su/venue/${venueId}/activate/`)
        toast(`${res.data.detail}`)
        console.log(`Venue ${venueId} enabled`)
      }
      fetchVenues()
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  // Render subscription badge with appropriate color
  const renderSubscriptionBadge = (subscription: string) => {
    switch (subscription.charAt(0).toUpperCase() + subscription.slice(1)) {
      case "Professional":
        return (
          <Badge className="border-pink-500 bg-white text-pink-500  dark:bg-gray-200 ">
            Professional
          </Badge>
        );
      case "Enterprise":
        return (
          <Badge className="border-blue-500 bg-white text-blue-500  dark:bg-gray-200">
            Enterprise
          </Badge>
        );
      case "Starter":
        return (
          <Badge className="border-purple-500 text-purple-500 bg-white  dark:bg-gray-200">
            Starter
          </Badge>
        );
      default:
        return <span className="text-gray-500">No Subscription</span>;
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: boolean) => {
    return status  ? (
      <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">
       Inactive
      </Badge>
    );
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVenues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

  const renderPagination = () => {
    if (filteredVenues.length <= itemsPerPage) return null;
  
    const pageNumbers = [];
    const maxPageDisplay = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    
    if (endPage - startPage + 1 < maxPageDisplay) {
      startPage = Math.max(1, endPage - maxPageDisplay + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }  
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pageNumbers.map(number => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(number);
                }}
                isActive={currentPage === number}
                className="cursor-pointer"
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
            {currentItems.length === 0 ? (
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
              currentItems.map((venue) => (
                <TableRow
                  key={venue.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-800"
                >
                  <TableCell className="text-base ">{venue.name}</TableCell>
                  <TableCell className="text-muted-foreground flex items-center gap-1">
                  {venue.address !== "" ? (
  <>
    <MapPin className="h-3 w-3" />
    {venue.address}
  </>
) : (
  <>None Provided</>
)}

                  </TableCell>
                  <TableCell>
                    {renderSubscriptionBadge(venue.subscription)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {venue.last_payment_date && venue.last_payment_date !== "None" ? (
    new Date(venue.last_qr_scanned).toLocaleString()
  ) : (
    <>No Payment</>
  )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
  <QrCode className="h-3 w-3" />
  {venue.last_qr_scanned && venue.last_qr_scanned !== "None" ? (
    new Date(venue.last_qr_scanned).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  ) : (
    <>Not scanned</>
  )}
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
                          <Link href={`/admin/venues/${venue.id}`}>
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center gap-2"
                          
                        >
                          <Edit className="h-4 w-4" /> 
                          <Link href={`/admin/venues/editVenue/${venue.id}`}>Edit Venue</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          <Link href={`/admin/venues/${venue.id}/usage`}>
                            View usage
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
  onClick={() => handleVenueStatus(venue.id, venue.status)} 
  className={`cursor-pointer flex items-center gap-2 ${
    venue.status
      ? "text-red-600 dark:text-red-400"
      : "text-green-600 dark:text-green-400"
  }`}
>
  {venue.status ? (
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

      {renderPagination()}
    </div>
  );
}










