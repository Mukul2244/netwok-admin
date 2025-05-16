"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock data for subscription plans
const subscriptionPlans = [
  {
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
  },
  {
    id: "plan_2",
    name: "Pro",
    description: "For growing venues with advanced needs",
    price: 79.99,
    interval: "month",
    features: ["Everything in Basic", "Advanced analytics", "Up to 500 users", "Priority support"],
    active: true,
    subscribers: 87,
    revenue: 6959.13,
    createdAt: "2023-09-15",
  },
  {
    id: "plan_3",
    name: "Enterprise",
    description: "For large venues with complex requirements",
    price: 199.99,
    interval: "month",
    features: ["Everything in Pro", "Unlimited users", "Custom branding", "Dedicated support"],
    active: true,
    subscribers: 32,
    revenue: 6399.68,
    createdAt: "2023-09-15",
  },
  {
    id: "plan_4",
    name: "Basic Annual",
    description: "Basic plan with annual billing",
    price: 299.99,
    interval: "year",
    features: ["QR code generation", "Basic analytics", "Up to 100 users"],
    active: true,
    subscribers: 45,
    revenue: 13499.55,
    createdAt: "2023-09-15",
  },
  {
    id: "plan_5",
    name: "Starter",
    description: "For new venues just getting started",
    price: 19.99,
    interval: "month",
    features: ["QR code generation", "Basic analytics", "Up to 50 users"],
    active: false,
    subscribers: 0,
    revenue: 0,
    createdAt: "2023-08-01",
  },
]

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter subscriptions based on search query and active tab
  const filteredSubscriptions = subscriptionPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && plan.active
    if (activeTab === "inactive") return matchesSearch && !plan.active

    return matchesSearch
  })

  // Calculate total revenue and subscribers
  const totalRevenue = subscriptionPlans.reduce((sum, plan) => sum + plan.revenue, 0)
  const totalSubscribers = subscriptionPlans.reduce((sum, plan) => sum + plan.subscribers, 0)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
        </div>
        <Button asChild>
          <Link href="/admin/subscriptions/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionPlans.filter((plan) => plan.active).length}</div>
            <p className="text-xs text-muted-foreground">Out of {subscriptionPlans.length} total plans</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              className="w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Price
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Subscribers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button variant="ghost" className="p-0 font-medium">
                          Plan Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{plan.name}</div>
                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${plan.price}/{plan.interval}
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.active ? "default" : "secondary"}>
                            {plan.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{plan.subscribers}</TableCell>
                        <TableCell>${plan.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/subscriptions/${plan.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{plan.name}</div>
                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${plan.price}/{plan.interval}
                        </TableCell>
                        <TableCell>{plan.subscribers}</TableCell>
                        <TableCell>${plan.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/subscriptions/${plan.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inactive" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{plan.name}</div>
                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${plan.price}/{plan.interval}
                        </TableCell>
                        <TableCell>{plan.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/subscriptions/${plan.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
