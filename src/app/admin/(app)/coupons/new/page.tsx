
"use client"

import { useState, ChangeEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Info } from "lucide-react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface FormData {
  token: string;
  description: string;
  discount_type: string;
  discount_value: string;
  min_purchase_amount: string;
  applicable_to: string;
  status: string;
  valid_from: string;
  valid_to: string;
  limited_users: boolean;
  limited_users_count: string;
  uses_per_user: string;
  new_customers_only: boolean;
  // venue: number;
}

// Status choices based on backend requirements
const STATUS_CHOICES = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "scheduled", label: "Scheduled" },
];

export default function NewCouponPage() {
  const router = useRouter()
  const [couponType, setCouponType] = useState("percentage")
  const [isLimited, setIsLimited] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    token: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: "0",
    applicable_to: "all",
    status: "active",
    valid_from: new Date().toISOString().split("T")[0],
    valid_to: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
    limited_users: true,
    limited_users_count: "50",
    uses_per_user: "1",
    new_customers_only: false,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    
    // Map input fields to formData properties
    const fieldMapping: Record<string, string> = {
      "coupon-code": "token",
      "description": "description",
      "discount-value": "discount_value",
      "min-purchase": "min_purchase_amount",
      "usage-limit": "limited_users_count",
      "valid-from": "valid_from",
      "valid-to": "valid_to"
    }
    
    const field = fieldMapping[id] || id
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    if (field === "per-customer") {
      setFormData(prev => ({
        ...prev,
        uses_per_user: value === "unlimited" ? "0" : value
      }))
    } else if (field === "applicable-to") {
      setFormData(prev => ({
        ...prev,
        applicable_to: value
      }))
    } else if (field === "status") {
      setFormData(prev => ({
        ...prev,
        status: value
      }))
    }
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    const mappings: Record<string, string> = {
      "limit-toggle": "limited_users",
      "new-customers-toggle": "new_customers_only"
    }
    
    setFormData(prev => ({
      ...prev,
      [mappings[field]]: checked
    }))
  }

  // Calculate status based on dates
  const determineInitialStatus = () => {
    const now = new Date();
    const validFromDate = new Date(formData.valid_from);
    const validToDate = new Date(formData.valid_to);

    if (validFromDate > now) {
      return "scheduled";
    } else if (validToDate < now) {
      return "expired";
    } else {
      return "active";
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setFormError("")
      
      // Format dates to ISO format with timezone
      const now = new Date()
      const timezone = now.toString().match(/([+-][0-9]{2}:?[0-9]{2}|Z)/)?.[0] || '+00:00'
      
      const validFrom = new Date(formData.valid_from).toISOString().replace('Z', timezone)
      const validTo = new Date(formData.valid_to).toISOString().replace('Z', timezone)
      
      // Prepare payload
      const payload = {
        ...formData,
        token: formData.token.toUpperCase(),
        discount_type: couponType,
        discount_value: formData.discount_value,
        min_purchase_amount: formData.min_purchase_amount || "0.00",
        valid_from: validFrom,
        valid_to: validTo,
        time_based: false,
        time_duration_hours: 1,
        expiry_time: null,
        limited_users: isLimited,
        limited_users_count: isLimited ? parseInt(formData.limited_users_count) : 0,
        total_redumptions: 0 // Start with 0 redemptions for new coupon
      }
      
      // Send API request
      const response = await api.post("/su/offers/", payload)
      
      // Handle success
      console.log("Coupon created successfully:", response.data)
      router.push("/admin/coupons")
      
    } catch (error) {
      console.error("Error creating coupon:", error)
      setFormError("Failed to create coupon. Please check your inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status color for preview
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-gray-500";
      case "scheduled":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };


  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/coupons">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Coupon</h1>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {formError}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Details</CardTitle>
                <CardDescription>Enter the basic information for your coupon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-code">
                    Coupon Code
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            Coupon codes should be uppercase, without spaces, and easy to remember. Examples: SUMMER23,
                            WELCOME10, FLASH50
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input 
                    id="coupon-code" 
                    placeholder="e.g. SUMMER23" 
                    className="uppercase"
                    value={formData.token}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description of the coupon" 
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <RadioGroup
                    defaultValue="percentage"
                    className="flex flex-col space-y-1"
                    onValueChange={(value) => {
                      setCouponType(value)
                      setFormData(prev => ({
                        ...prev,
                        discount_type: value
                      }))
                    }}
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
                  <Label htmlFor="discount-value">Discount Value {couponType === "percentage" ? "(%" : "($"})</Label>
                  <div className="relative">
                    <Input
                      id="discount-value"
                      type="number"
                      placeholder={couponType === "percentage" ? "e.g. 20" : "e.g. 50"}
                      min={1}
                      max={couponType === "percentage" ? 100 : undefined}
                      value={formData.discount_value}
                      onChange={handleInputChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {couponType === "percentage" ? "%" : "$"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>Set restrictions on how the coupon can be used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="limit-toggle">Limit number of uses</Label>
                    <p className="text-sm text-muted-foreground">Restrict how many times this coupon can be redeemed</p>
                  </div>
                  <Switch 
                    id="limit-toggle" 
                    checked={isLimited} 
                    onCheckedChange={(checked) => {
                      setIsLimited(checked)
                      handleSwitchChange("limit-toggle", checked)
                    }}
                  />
                </div>

                {isLimited && (
                  <div className="space-y-2">
                    <Label htmlFor="usage-limit">Maximum uses</Label>
                    <Input 
                      id="usage-limit" 
                      type="number" 
                      placeholder="e.g. 100" 
                      min={1}
                      value={formData.limited_users_count}
                      onChange={handleInputChange} 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="per-customer">Uses per customer</Label>
                  <Select 
                    defaultValue="1"
                    onValueChange={(value) => handleSelectChange("per-customer", value)}
                  >
                    <SelectTrigger id="per-customer">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 use per customer</SelectItem>
                      <SelectItem value="3">3 uses per customer</SelectItem>
                      <SelectItem value="5">5 uses per customer</SelectItem>
                      <SelectItem value="unlimited">Unlimited uses per customer</SelectItem>
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
                <CardDescription>Set when the coupon is valid for use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid-from">Valid From</Label>
                    <div className="relative">
                      <Input 
                        id="valid-from" 
                        type="date" 
                        value={formData.valid_from}
                        onChange={handleInputChange}
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
                        value={formData.valid_to}
                        onChange={handleInputChange}
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue="active"
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_CHOICES.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status will be automatically updated based on the validity dates
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eligibility</CardTitle>
                <CardDescription>Define which plans or users can use this coupon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicable-to">Applicable To</Label>
                  <Select 
                    defaultValue="all"
                    onValueChange={(value) => handleSelectChange("applicable-to", value)}
                  >
                    <SelectTrigger id="applicable-to">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All plans</SelectItem>
                      <SelectItem value="starters">Starter plan only</SelectItem>
                      <SelectItem value="profesional">Professional plan only</SelectItem>
                      <SelectItem value="enterprise">Enterprise plan only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-purchase">Minimum Purchase Amount ($)</Label>
                  <div className="relative">
                    <Input 
                      id="min-purchase" 
                      type="number" 
                      placeholder="e.g. 50" 
                      min={0}
                      value={formData.min_purchase_amount}
                      onChange={handleInputChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">$</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-customers-toggle">New customers only</Label>
                    <p className="text-sm text-muted-foreground">Limit this coupon to first-time customers</p>
                  </div>
                  <Switch 
                    id="new-customers-toggle"
                    checked={formData.new_customers_only}
                    onCheckedChange={(checked) => handleSwitchChange("new-customers-toggle", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your coupon will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold uppercase">{formData.token || "COUPON"}</div>
                      <div className="text-sm text-muted-foreground">{formData.description || "Coupon description"}</div>
                    </div>
                    <div className={`${getStatusColor(formData.status)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                      {STATUS_CHOICES.find(s => s.value === formData.status)?.label || "Active"}
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold text-center">
                    {couponType === "percentage" ? 
                      `${formData.discount_value || "0"}% OFF` : 
                      `$${formData.discount_value || "0"} OFF`}
                  </div>
                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    Valid until {new Date(formData.valid_to).toLocaleDateString()}
                  </div>
                  <div className="mt-4 text-xs text-center">
                    <span className="text-muted-foreground">Applicable to: </span>
                    <span>{formData.applicable_to === "all" ? "All plans" : 
                        formData.applicable_to.charAt(0).toUpperCase() + formData.applicable_to.slice(1) + " plan only"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/coupons">Cancel</Link>
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </main>
    </div>
  )
}