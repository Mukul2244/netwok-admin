"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Edit, Info, Save, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data for a subscription plan
const subscriptionPlan = {
  id: "plan_1",
  name: "Basic",
  description: "For small venues with basic needs",
  price: 29.99,
  interval: "month",
  features: ["QR code generation", "Basic analytics", "Up to 100 users"],
  active: true,
  subscribers: 124,
  revenue: 3718.76,
  createdAt: "2023-09-15",
  userLimit: 100,
  qrLimit: 5,
  analytics: true,
  branding: false,
  support: false,
  api: false,
}

// Mock data for subscribers
const subscribers = [
  {
    id: "venue_1",
    name: "The Coffee House",
    email: "info@coffeehouse.com",
    subscribedOn: "2023-10-01",
    status: "active",
  },
  { id: "venue_2", name: "Bistro 22", email: "contact@bistro22.com", subscribedOn: "2023-10-05", status: "active" },
  { id: "venue_3", name: "Green Garden", email: "hello@greengarden.com", subscribedOn: "2023-10-10", status: "active" },
  { id: "venue_4", name: "Sunset Bar", email: "info@sunsetbar.com", subscribedOn: "2023-10-15", status: "active" },
  { id: "venue_5", name: "Urban Diner", email: "contact@urbandiner.com", subscribedOn: "2023-10-20", status: "active" },
]

export default function SubscriptionDetailPage() {

  const [isEditing, setIsEditing] = useState(false)
  const [features, setFeatures] = useState<string[]>(subscriptionPlan.features)
  const [newFeature, setNewFeature] = useState("")

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/admin/subscriptions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subscriptionPlan.name} Plan</h1>
            <p className="text-muted-foreground">Manage subscription plan details and subscribers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionPlan.subscribers}</div>
            <p className="text-xs text-muted-foreground">+8 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscriptionPlan.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge variant={subscriptionPlan.active ? "default" : "secondary"} className="text-xs">
                {subscriptionPlan.active ? "Active" : "Inactive"}
              </Badge>
              <span className="ml-2 text-xs text-muted-foreground">Since {subscriptionPlan.createdAt}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Visible to all venues</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="details">Plan Details</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                  <CardDescription>Basic information about the subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input id="name" defaultValue={subscriptionPlan.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue={subscriptionPlan.description} rows={3} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="active">Active</Label>
                          <Switch id="active" defaultChecked={subscriptionPlan.active} />
                        </div>
                        <p className="text-sm text-muted-foreground">When active, venues can subscribe to this plan</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Plan Name</Label>
                        <p className="font-medium">{subscriptionPlan.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Description</Label>
                        <p>{subscriptionPlan.description}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="flex items-center">
                          <Badge variant={subscriptionPlan.active ? "default" : "secondary"}>
                            {subscriptionPlan.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Created On</Label>
                        <p>{subscriptionPlan.createdAt}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Price and billing interval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-7"
                            defaultValue={subscriptionPlan.price}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interval">Billing Interval</Label>
                        <Select defaultValue={subscriptionPlan.interval}>
                          <SelectTrigger id="interval">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                            <SelectItem value="quarter">Quarterly</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Price</Label>
                        <p className="text-2xl font-bold">
                          ${subscriptionPlan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{subscriptionPlan.interval}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Billing Interval</Label>
                        <p className="capitalize">{subscriptionPlan.interval}ly</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>Features included in this plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Included Features</Label>
                        <div className="rounded-md border">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between border-b p-3 last:border-0">
                              <div className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                                <Trash className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature..."
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addFeature()
                            }
                          }}
                        />
                        <Button onClick={addFeature}>Add</Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Limitations & Restrictions</CardTitle>
                  <CardDescription>Usage limits and restrictions for this plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="user-limit">User Limit</Label>
                        <div className="flex items-center gap-2">
                          <Input id="user-limit" type="number" min="0" defaultValue={subscriptionPlan.userLimit} />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Maximum number of users the venue can have</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Switch id="unlimited-users" />
                          <Label htmlFor="unlimited-users">Unlimited users</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qr-limit">QR Code Limit</Label>
                        <div className="flex items-center gap-2">
                          <Input id="qr-limit" type="number" min="0" defaultValue={subscriptionPlan.qrLimit} />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Maximum number of QR codes the venue can create</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Switch id="unlimited-qr" />
                          <Label htmlFor="unlimited-qr">Unlimited QR codes</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Feature Access</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>Analytics Dashboard</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Access to detailed analytics and reports</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch id="analytics" defaultChecked={subscriptionPlan.analytics} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>Custom Branding</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ability to customize branding and colors</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch id="branding" defaultChecked={subscriptionPlan.branding} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>Priority Support</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Access to priority customer support</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch id="support" defaultChecked={subscriptionPlan.support} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>API Access</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Access to API for integration with other systems</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch id="api" defaultChecked={subscriptionPlan.api} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">User Limit</Label>
                        <p>{subscriptionPlan.userLimit === 0 ? "Unlimited" : subscriptionPlan.userLimit} users</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">QR Code Limit</Label>
                        <p>{subscriptionPlan.qrLimit === 0 ? "Unlimited" : subscriptionPlan.qrLimit} QR codes</p>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Feature Access</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${subscriptionPlan.analytics ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <span>Analytics Dashboard</span>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${subscriptionPlan.branding ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <span>Custom Branding</span>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${subscriptionPlan.support ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <span>Priority Support</span>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${subscriptionPlan.api ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <span>API Access</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how this plan will appear to venues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{subscriptionPlan.name} Plan</h3>
                      <div className="mt-2 text-3xl font-bold">
                        ${subscriptionPlan.price}
                        <span className="text-sm font-normal text-muted-foreground">/{subscriptionPlan.interval}</span>
                      </div>
                      <p className="mt-2 text-muted-foreground">{subscriptionPlan.description}</p>
                      <Button className="mt-4 w-full">Subscribe Now</Button>
                      <div className="mt-6 space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>Venues subscribed to this plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                  <div>Venue</div>
                  <div>Email</div>
                  <div>Subscribed On</div>
                  <div>Status</div>
                </div>
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
                    <div>{subscriber.name}</div>
                    <div>{subscriber.email}</div>
                    <div>{subscriber.subscribedOn}</div>
                    <div>
                      <Badge variant="outline" className="capitalize">
                        {subscriber.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 5 of {subscriptionPlan.subscribers} subscribers
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>Performance metrics for this subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Subscription analytics chart will be displayed here</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.5%</div>
                    <p className="text-xs text-muted-foreground">+2.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">-0.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg. Subscription Length</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.3 months</div>
                    <p className="text-xs text-muted-foreground">+0.7 from last quarter</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
