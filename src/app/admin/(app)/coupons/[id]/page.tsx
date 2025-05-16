
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Copy, Trash } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Coupon } from "@/interfaces/Coupon";
import api from "@/lib/axios";

// Sample usage data
const usageData = [
  {
    date: "2023-06-05",
    user: "john.doe@example.com",
    venue: "Central Perk",
    amount: 79.99,
  },
  {
    date: "2023-06-12",
    user: "jane.smith@example.com",
    venue: "The Golden Pub",
    amount: 129.99,
  },
  {
    date: "2023-06-18",
    user: "robert.johnson@example.com",
    venue: "Blue Horizon",
    amount: 59.99,
  },
  {
    date: "2023-06-25",
    user: "emily.wilson@example.com",
    venue: "Sunset Cafe",
    amount: 99.99,
  },
  {
    date: "2023-07-02",
    user: "michael.brown@example.com",
    venue: "Red Lion",
    amount: 149.99,
  },
];

export default function CouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: couponId } = use(params);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [isLimited, setIsLimited] = useState(false);
  const [maxUses, setMaxUses] = useState("");
  const [usesPerCustomer, setUsesPerCustomer] = useState("1");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [applicableTo, setApplicableTo] = useState("all");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("0");
  const [newCustomersOnly, setNewCustomersOnly] = useState(false);

  // Format date to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    }
    return "";
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "-";
  };

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/su/offers/${couponId}/`);
      console.log("Fetched coupon data:", res.data);
      setCoupon(res.data);

      // Set form state from coupon data
      setDescription(res.data.description || "");
      setDiscountType(res.data.discount_type || "percentage");
      setDiscountValue(res.data.discount_value?.toString() || "");
      setIsLimited(res.data.limited_users_count !== null);
      setMaxUses(res.data.limited_users_count?.toString() || "");
      setUsesPerCustomer(res.data.uses_per_user?.toString() || "1");
      setValidFrom(
        res.data.valid_from ? formatDateForInput(res.data.valid_from) : ""
      );
      setValidTo(
        res.data.valid_to ? formatDateForInput(res.data.valid_to) : ""
      );
      setIsActive(res.data.status === "active");
      setApplicableTo(res.data.applicable_to || "all");
      setMinPurchaseAmount(res.data.min_purchase_amount?.toString() || "0");
      setNewCustomersOnly(res.data.new_customers_only || false);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      toast.error("Failed to fetch coupon details!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  // Updated handleSaveChanges function with proper status handling

const handleSaveChanges = async () => {
  try {
    setLoading(true);

    // Determine the correct status value based on dates and isActive flag
    let statusValue;
    const currentDate = new Date();
    const validFromDate = validFrom ? new Date(validFrom) : null;
    const validToDate = validTo ? new Date(validTo) : null;

    if (!isActive) {
      statusValue = "expired"; // If toggle is off, mark as expired
    } else if (validFromDate && validFromDate > currentDate) {
      statusValue = "scheduled"; // If start date is in future, mark as scheduled
    } else if (validToDate && validToDate < currentDate) {
      statusValue = "expired"; // If end date is in past, mark as expired
    } else {
      statusValue = "active"; // Otherwise, mark as active
    }

    // Create payload as a JSON object
    const payload = {
      description: description,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      limited_users_count: isLimited ? parseInt(maxUses) : null,
      limited_users: isLimited,
      uses_per_user: usesPerCustomer === "unlimited" ? 0 : parseInt(usesPerCustomer),
      valid_from: validFrom || null,
      valid_to: validTo || null,
      status: statusValue, // Use the calculated status value
      applicable_to: applicableTo,
      min_purchase_amount: parseFloat(minPurchaseAmount),
      new_customers_only: newCustomersOnly
    };

    console.log("Sending payload:", payload);
    const response = await api.patch(`/su/offers/${couponId}/`, payload);
    console.log("Updated coupon:", response.data);

    // Update local state with the response data
    setCoupon(response.data);
    toast.success("Coupon updated successfully");
  } catch (error) {
    console.error("Error updating coupon:", error);
    toast.error("Failed to update coupon. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const handleDeleteCoupon = async () => {
    try {
      setLoading(true);
      await api.delete(`/su/offers/${couponId}/`);
      toast.success("Coupon deleted successfully");
      // Redirect to coupons list page
      window.location.href = "/admin/coupons";
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/coupons">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Edit Coupon</h1>
            <Badge
              variant={
                coupon?.status === "active"
                  ? "default"
                  : coupon?.status === "scheduled"
                  ? "outline"
                  : "secondary"
              }
              className={
                coupon?.status === "active"
                  ? "bg-green-500 hover:bg-green-600 ml-2"
                  : coupon?.status === "scheduled"
                  ? "border-blue-500 text-blue-500 ml-2"
                  : "ml-2"
              }
            >
              {coupon?.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the coupon "{couponId}". This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteCoupon} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-xl font-medium">Loading coupon data...</div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="details" className="flex-1 sm:flex-initial">
                Details
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex-1 sm:flex-initial">
                Usage History
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 sm:flex-initial">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Coupon Details</CardTitle>
                      <CardDescription>
                        Edit the basic information for your coupon
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="coupon-code">Coupon Code</Label>
                        <Input
                          id="coupon-code"
                          value={coupon?.id || ""}
                          className="uppercase bg-muted"
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Coupon codes cannot be changed after creation
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Discount Type</Label>
                        <RadioGroup
                          value={discountType}
                          onValueChange={setDiscountType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id="percentage" />
                            <Label htmlFor="percentage" className="font-normal">
                              Percentage discount
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <Label htmlFor="fixed" className="font-normal">
                              Fixed amount discount
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount-value">
                          Discount Value{" "}
                          {discountType === "percentage" ? "(%" : "($"})
                        </Label>
                        <div className="relative">
                          <Input
                            id="discount-value"
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            min={1}
                            max={discountType === "percentage" ? 100 : undefined}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {discountType === "percentage" ? "%" : "$"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Limits</CardTitle>
                      <CardDescription>
                        Set restrictions on how the coupon can be used
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="limit-toggle">
                            Limit number of uses
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Restrict how many times this coupon can be redeemed
                          </p>
                        </div>
                        <Switch
                          id="limit-toggle"
                          checked={isLimited}
                          onCheckedChange={setIsLimited}
                        />
                      </div>

                      {isLimited && (
                        <div className="space-y-2">
                          <Label htmlFor="usage-limit">Maximum uses</Label>
                          <Input
                            id="usage-limit"
                            type="number"
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                            min={1}
                          />
                          <p className="text-xs text-muted-foreground">
                            Current usage: {coupon?.total_redumptions || 0} /{" "}
                            {coupon?.limited_users_count || 0}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="per-customer">Uses per customer</Label>
                        <Select
                          value={usesPerCustomer}
                          onValueChange={setUsesPerCustomer}
                        >
                          <SelectTrigger id="per-customer">
                            <SelectValue placeholder="Select limit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 use per customer</SelectItem>
                            <SelectItem value="3">3 uses per customer</SelectItem>
                            <SelectItem value="5">5 uses per customer</SelectItem>
                            <SelectItem value="unlimited">
                              Unlimited uses per customer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Validity Period</CardTitle>
                      <CardDescription>
                        Set when the coupon is valid for use
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valid-from">Valid From</Label>
                          <div className="relative">
                            <Input
                              id="valid-from"
                              type="date"
                              value={validFrom}
                              onChange={(e) => setValidFrom(e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valid-to">Valid To</Label>
                          <div className="relative">
                            <Input
                              id="valid-to"
                              type="date"
                              value={validTo}
                              onChange={(e) => setValidTo(e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="active-toggle">Active</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable or disable this coupon
                          </p>
                        </div>
                        <Switch
                          id="active-toggle"
                          checked={isActive}
                          onCheckedChange={setIsActive}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Eligibility</CardTitle>
                      <CardDescription>
                        Define which plans or users can use this coupon
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicable-to">Applicable To</Label>
                        <Select 
                          value={applicableTo}
                          onValueChange={setApplicableTo}
                        >
                          <SelectTrigger id="applicable-to">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All plans</SelectItem>
                            <SelectItem value="starters">
                              Starter plan only
                            </SelectItem>
                            <SelectItem value="professional">
                              Professional plan only
                            </SelectItem>
                            <SelectItem value="enterprise">
                              Enterprise plan only
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="min-purchase">
                          Minimum Purchase Amount ($)
                        </Label>
                        <div className="relative">
                          <Input
                            id="min-purchase"
                            type="number"
                            value={minPurchaseAmount}
                            onChange={(e) => setMinPurchaseAmount(e.target.value)}
                            min={0}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            $
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-customers-toggle">
                            New customers only
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Limit this coupon to first-time customers
                          </p>
                        </div>
                        <Switch
                          id="new-customers-toggle"
                          checked={newCustomersOnly}
                          onCheckedChange={setNewCustomersOnly}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Coupon Information</CardTitle>
                      <CardDescription>
                        Additional details about this coupon
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Created On
                        </div>
                        <div>
                          {coupon?.created_at
                            ? formatDate(coupon?.created_at)
                            : "-"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Total Redemptions
                        </div>
                        <div>
                          {coupon?.total_redumptions || 0}{" "}
                          {isLimited && `/ ${coupon?.limited_users_count || 0}`}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Status
                        </div>
                        <div className="capitalize">{coupon?.status}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link href="/admin/coupon">Cancel</Link>
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage History</CardTitle>
                  <CardDescription>
                    Track when and how this coupon has been used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                      <div>Date</div>
                      <div>User</div>
                      <div>Venue</div>
                      <div className="text-right">Amount</div>
                    </div>
                    {usageData.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No usage data available for this coupon
                      </div>
                    ) : (
                      usageData.map((usage, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-4 p-4 border-b last:border-0"
                        >
                          <div>{formatDate(usage.date)}</div>
                          <div className="truncate">{usage.user}</div>
                          <div>{usage.venue}</div>
                          <div className="text-right">
                            ${usage.amount.toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>
                    Download usage data for reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Export All Usage Data
                    </Button>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Export Current Month
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coupon Performance</CardTitle>
                  <CardDescription>
                    Analytics and insights for this coupon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Redemptions
                      </div>
                      <div className="text-3xl font-bold">
                        {coupon?.total_redumptions || 0}
                      </div>
                      {isLimited && (
                        <div className="text-sm text-muted-foreground">
                          {coupon && coupon.limited_users_count && (
                            (((coupon?.total_redumptions || 0) /
                              coupon?.limited_users_count) *
                              100).toFixed(1)
                          )}
                          % of maximum
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </div>
                      <div className="text-3xl font-bold">
                        $
                        {usageData
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        From {usageData.length} transactions
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Avg. Order Value
                      </div>
                      <div className="text-3xl font-bold">
                        $
                        {usageData.length > 0
                          ? (
                              usageData.reduce((sum, item) => sum + item.amount, 0) /
                              usageData.length
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Per transaction
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 h-[300px] w-full flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">
                        Redemption Timeline
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Visualization of coupon usage over time will be displayed
                        here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

                         <Card>
              <CardHeader>
                 <CardTitle>Usage Breakdown</CardTitle>
                 <CardDescription>
                  How this coupon? is being used
                </CardDescription>
               </CardHeader>
               <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">By Plan</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          <span>Starter</span>
                        </div>
                        <div className="font-medium">15 (36%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[36%] rounded-full bg-purple-500"></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                          <span>Professional</span>
                        </div>
                        <div className="font-medium">22 (52%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[52%] rounded-full bg-pink-500"></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span>Enterprise</span>
                        </div>
                        <div className="font-medium">5 (12%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[12%] rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">By User Type</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span>New Users</span>
                        </div>
                        <div className="font-medium">28 (67%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[67%] rounded-full bg-green-500"></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span>Returning Users</span>
                        </div>
                        <div className="font-medium">14 (33%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[33%] rounded-full bg-orange-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>            </Card>
          </TabsContent>
         </Tabs>)
}
         </main>
         </div>
        
                                         
                          
    
  );
}




