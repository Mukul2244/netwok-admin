"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Info, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function NewSubscriptionPage() {
  const [features, setFeatures] = useState<string[]>(["QR code generation", "Basic analytics"])
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
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/subscriptions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h1>
          <p className="text-muted-foreground">Create a new subscription plan for your venues</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Basic information about the subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input id="name" placeholder="e.g. Basic, Pro, Enterprise" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what this plan offers" rows={3} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Active</Label>
                  <Switch id="active" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">When active, venues can subscribe to this plan</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the price and billing interval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard Pricing</TabsTrigger>
                  <TabsTrigger value="tiered">Tiered Pricing</TabsTrigger>
                </TabsList>
                <TabsContent value="standard" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input id="price" type="number" min="0" step="0.01" className="pl-7" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interval">Billing Interval</Label>
                      <Select defaultValue="month">
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trial">Free Trial</Label>
                      <Switch id="trial" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trial-days">Trial Days</Label>
                        <Input id="trial-days" type="number" min="0" placeholder="14" disabled />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tiered" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Pricing Tiers</Label>
                    <p className="text-sm text-muted-foreground">Set different prices based on usage or features</p>
                    <div className="mt-2 space-y-2">
                      <div className="rounded-md border p-4">
                        <div className="font-medium">Tier 1 (Basic)</div>
                        <div className="mt-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tier1-price">Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input
                                id="tier1-price"
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-7"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tier1-limit">User Limit</Label>
                            <Input id="tier1-limit" type="number" min="0" placeholder="100" />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="font-medium">Tier 2 (Pro)</div>
                        <div className="mt-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tier2-price">Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input
                                id="tier2-price"
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-7"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tier2-limit">User Limit</Label>
                            <Input id="tier2-limit" type="number" min="0" placeholder="500" />
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 ">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tier
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Define what features are included in this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Button className="bg-black text-white dark:bg-white dark:text-black" onClick={addFeature}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Limitations & Restrictions</CardTitle>
              <CardDescription>Set usage limits and restrictions for this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-limit">User Limit</Label>
                <div className="flex items-center gap-2">
                  <Input id="user-limit" type="number" min="0" placeholder="e.g. 100" />
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
                  <Input id="qr-limit" type="number" min="0" placeholder="e.g. 5" />
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
                    <Switch id="analytics" defaultChecked />
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
                    <Switch id="branding" />
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
                    <Switch id="support" />
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
                    <Switch id="api" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment options for this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="rounded-md border p-4">
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-methods" />
                      <Label htmlFor="all-methods">All payment methods</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="card" id="card-only" />
                      <Label htmlFor="card-only">Credit/debit cards only</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="custom" id="custom-methods" />
                      <Label htmlFor="custom-methods">Custom selection</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tax Settings</Label>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tax-inclusive">Tax Inclusive Pricing</Label>
                    <Switch id="tax-inclusive" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    When enabled, the displayed price includes applicable taxes
                  </p>
                </div>
              </div>
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
                  <h3 className="text-xl font-bold">Basic Plan</h3>
                  <div className="mt-2 text-3xl font-bold">
                    $29.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">For small venues with basic needs</p>
                  <Button className="mt-4 w-full bg-black text-white dark:bg-white dark:text-black">Subscribe Now</Button>
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

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/subscriptions">Cancel</Link>
        </Button>
        <Button className="bg-black text-white dark:bg-white dark:text-black">
          <CreditCard className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>
    </div>
  )
}
