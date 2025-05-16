"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Calendar,
  Check,
  Copy,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  Trash,
} from "lucide-react";
import api from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coupon } from "@/interfaces/Coupon";

export default function CouponsPage() {
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [coupons, setCoupon] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/su/offers/");
      console.log(res.data, "offerssssss");
      setCoupon(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons based on search query and status filter
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle selection of all coupons
  const toggleSelectAll = () => {
    if (selectedCoupons.length === filteredCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(filteredCoupons.map((coupon) => coupon.token));
    }
  };

  // Toggle selection of a single coupon
  const toggleSelectCoupon = (id: string) => {
    if (selectedCoupons.includes(id)) {
      setSelectedCoupons(selectedCoupons.filter((couponId) => couponId !== id));
    } else {
      setSelectedCoupons([...selectedCoupons, id]);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (dateString != null) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      return "-";
    }
  };

  // Function to download coupon data as CSV
  const handleDownload = () => {
    // Define CSV headers
    const headers = [
      "Code",
      "Description",
      "Type",
      "Value",
      "Usage",
      "Usage Limit",
      "Valid From",
      "Valid To",
      "Status",
      "Applicable To",
    ];

    // Format coupon data for CSV
    const csvData = filteredCoupons.map((coupon) => [
      coupon.token,
      coupon.description,
      coupon.discount_type,
      coupon.discount_type === "percentage"
        ? `${coupon.discount_value}%`
        : `$${coupon.discount_value}`,
      coupon.total_redumptions,
      coupon.limited_users_count,
      coupon.valid_from
        ? new Date(coupon.valid_from).toLocaleDateString()
        : "-",
      coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString() : "-",
      coupon.status,
      coupon.applicable_to,
    ]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows to CSV
    csvContent += csvData
      .map((row) =>
        row
          .map((cell) =>
            // Escape quotes and wrap in quotes if contains comma
            cell
              ? cell.toString().includes(",")
                ? `"${cell.toString().replace(/"/g, '""')}"`
                : cell
              : "-"
          )
          .join(",")
      )
      .join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `coupons-export-${date}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
            asChild
          >
            <Link href="/admin/coupons/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All Coupons</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search coupons..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        statusFilter === "all" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        statusFilter === "active" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("scheduled")}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        statusFilter === "scheduled"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    Scheduled
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("expired")}>
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        statusFilter === "expired" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    Expired
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedCoupons.length === filteredCoupons.length &&
                            filteredCoupons.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all coupons"
                        />
                      </TableHead>
                      <TableHead className="w-40">
                        <div className="flex items-center space-x-1">
                          <span>Code</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Value
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Usage
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Valid Period
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No coupons found. Try adjusting your filters or create
                          a new coupon.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCoupons.map((coupon) => (
                        <TableRow key={coupon.token}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCoupons.includes(coupon.token)}
                              onCheckedChange={() =>
                                toggleSelectCoupon(coupon.token)
                              }
                              aria-label={`Select coupon ${coupon.token}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{coupon.token}</span>
                            </div>
                          </TableCell>
                          <TableCell>{coupon.description}</TableCell>
                          <TableCell className="hidden md:table-cell capitalize">
                            {coupon.discount_type}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {coupon.discount_type === "percentage"
                              ? `${coupon.discount_value}%`
                              : `$${coupon.discount_value}`}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {coupon.limited_users ? (
                              <>
                                {coupon.total_redumptions} /{" "}
                                {coupon.limited_users_count}
                                <div className="w-full h-2 bg-muted rounded-full mt-1">
                                  <div
                                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                                    style={{
                                      width: `${
                                        (coupon.total_redumptions /
                                          coupon.limited_users_count) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              "No limit"
                            )}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                From: {formatDate(coupon.valid_from)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                To: {formatDate(coupon.valid_to)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                coupon.status === "active"
                                  ? "default"
                                  : coupon.status === "scheduled"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                coupon.status === "active"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : coupon.status === "scheduled"
                                  ? "border-blue-500 text-blue-500"
                                  : ""
                              }
                            >
                              {coupon.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/coupons/${coupon.id}`}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center cursor-pointer">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center text-red-600 cursor-pointer">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {coupons
                    .filter((coupon) => coupon.status === "active")
                    .map((coupon) => (
                      <Card key={coupon.id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold">
                              {coupon.token}
                            </CardTitle>
                            <Badge
                              variant="default"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Active
                            </Badge>
                          </div>
                          <CardDescription>
                            {coupon.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Discount:
                              </span>
                              <span className="font-medium">
                                {coupon.discount_type === "percentage"
                                  ? `${coupon.discount_value}%`
                                  : `$${coupon.discount_value}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Usage:
                              </span>
                              <span className="font-medium">
                                {coupon.total_redumptions} /{" "}
                                {coupon.limited_users_count}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Valid until:
                              </span>
                              <span className="font-medium">
                                {formatDate(coupon.valid_to)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Applicable to:
                              </span>
                              <span className="font-medium capitalize">
                                {coupon.applicable_to}
                              </span>
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/coupons/${coupon.id}`}>
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {coupons
                    .filter((coupon) => coupon.status === "scheduled")
                    .map((coupon) => (
                      <Card key={coupon.id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-blue-600/10 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold">
                              {coupon.token}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-500"
                            >
                              Scheduled
                            </Badge>
                          </div>
                          <CardDescription>
                            {coupon.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Discount:
                              </span>
                              <span className="font-medium">
                                {coupon.discount_type === "percentage"
                                  ? `${coupon.discount_value}%`
                                  : `$${coupon.discount_value}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Starts on:
                              </span>
                              <span className="font-medium">
                                {formatDate(coupon.valid_from)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Ends on:
                              </span>
                              <span className="font-medium">
                                {formatDate(coupon.valid_to)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Applicable to:
                              </span>
                              <span className="font-medium capitalize">
                                {coupon.applicable_to}
                              </span>
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/coupons/${coupon.id}`}>
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {coupons
                    .filter((coupon) => coupon.status === "expired")
                    .map((coupon) => (
                      <Card key={coupon.id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-200 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold">
                              {coupon.token}
                            </CardTitle>
                            <Badge variant="secondary">Expired</Badge>
                          </div>
                          <CardDescription>
                            {coupon.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Discount:
                              </span>
                              <span className="font-medium">
                                {coupon.discount_type === "percentage"
                                  ? `${coupon.discount_value}%`
                                  : `$${coupon.discount_value}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Usage:
                              </span>
                              <span className="font-medium">
                                {coupon.total_redumptions} /{" "}
                                {coupon.limited_users_count}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Expired on:
                              </span>
                              <span className="font-medium">
                                {formatDate(coupon.valid_to)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Applicable to:
                              </span>
                              <span className="font-medium capitalize">
                                {coupon.applicable_to}
                              </span>
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Copy className="mr-1 h-3 w-3" />
                                Duplicate
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Usage Analytics</CardTitle>
              <CardDescription>
                Overview of coupon usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Active Coupons
                  </div>
                  <div className="text-3xl font-bold">
                    {
                      coupons.filter((coupon) => coupon.status === "active")
                        .length
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Redemptions
                  </div>
                  <div className="text-3xl font-bold">
                    {coupons.reduce(
                      (total, coupon) => total + coupon.total_redumptions,
                      0
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Avg. Discount Value
                  </div>
                  <div className="text-3xl font-bold">
                    {coupons.filter(
                      (coupon) => coupon.discount_type === "percentage"
                    ).length > 0
                      ? `${Math.round(
                          coupons
                            .filter(
                              (coupon) => coupon.discount_type === "percentage"
                            )
                            .reduce(
                              (sum, coupon) => sum + coupon.discount_value,
                              0
                            ) /
                            coupons.filter(
                              (coupon) => coupon.discount_type === "percentage"
                            ).length
                        )}%`
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-8 h-[300px] w-full flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Coupon Usage Chart
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Visualization of coupon usage over time will be displayed
                    here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
