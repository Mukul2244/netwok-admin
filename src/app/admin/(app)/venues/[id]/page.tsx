

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams} from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  QrCode,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { Toaster } from "@/components/ui/toaster"


interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
}

interface Venue {
  id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
  subscription: string;
  subscriptionStartDate: string;
  lastPayment: string;
  nextPaymentDue: string;
  status: string;
  lastQrScanned: string;
  totalScans: number;
  activeVisitors: number;
  totalVisitors: number;
  averageStay: string;
  popularTimes: string[];
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  socialMedia: SocialMedia;
  createdAt: string;
  updatedAt: string;
}

// Mock venue data - in a real app, you would fetch this from an API
const getVenueById = (id: string) => {
  const venues = [
    {
      id: 1,
      name: "The Golden Pub",
      type: "Pub & Restaurant",
      address: "123 Main St, London, UK",
      city: "London",
      state: "England",
      postalCode: "SW1A 1AA",
      country: "United Kingdom",
      description:
        "A traditional British pub with a modern twist, offering a wide selection of craft beers and gourmet pub food.",
      subscription: "Professional",
      subscriptionStartDate: "2023-01-15",
      lastPayment: "2023-06-15",
      nextPaymentDue: "2023-07-15",
      status: "active",
      lastQrScanned: "2023-06-18T14:32:00Z",
      totalScans: 1245,
      activeVisitors: 24,
      totalVisitors: 3567,
      averageStay: "1h 45m",
      popularTimes: ["Friday 7pm-10pm", "Saturday 8pm-12am", "Sunday 2pm-6pm"],
      contactName: "James Wilson",
      contactPosition: "Owner",
      contactEmail: "james@goldenpub.com",
      contactPhone: "+44 20 1234 5678",
      website: "https://goldenpub.com",
      socialMedia: {
        facebook: "goldenpub",
        instagram: "thegoldenpub",
        twitter: "goldenpub",
      },
      createdAt: "2023-01-10T09:00:00Z",
      updatedAt: "2023-06-15T11:30:00Z",
    },
    {
      id: 2,
      name: "Blue Horizon",
      type: "Beach Bar & Restaurant",
      address: "456 Ocean Dr, Miami, FL",
      city: "Miami",
      state: "Florida",
      postalCode: "33139",
      country: "United States",
      description:
        "A beachfront bar and restaurant offering tropical cocktails and fresh seafood with stunning ocean views.",
      subscription: "Enterprise",
      subscriptionStartDate: "2023-02-10",
      lastPayment: "2023-06-10",
      nextPaymentDue: "2023-07-10",
      status: "active",
      lastQrScanned: "2023-06-17T19:45:00Z",
      totalScans: 2187,
      activeVisitors: 36,
      totalVisitors: 5842,
      averageStay: "2h 15m",
      popularTimes: ["Thursday 6pm-9pm", "Friday 7pm-11pm", "Saturday 2pm-11pm"],
      contactName: "Maria Rodriguez",
      contactPosition: "Manager",
      contactEmail: "maria@bluehorizon.com",
      contactPhone: "+1 305 987 6543",
      website: "https://bluehorizonmiami.com",
      socialMedia: {
        facebook: "bluehorizonmiami",
        instagram: "bluehorizon_miami",
        twitter: "bluehorizonmia",
      },
      createdAt: "2023-02-05T10:15:00Z",
      updatedAt: "2023-06-10T14:45:00Z",
    },
  ]

  return venues.find((venue) => venue.id === Number.parseInt(id))
}



export default function VenueDetailsPage() {
  const { id } = useParams();

  const [venue, setVenue] = useState<Venue | null>(null);

  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the venue data from an API
      const venueData = getVenueById(id as string)
      if(!venueData){
        return;
      }
      setVenue(venueData)
      setLoading(false)
    }
  }, [id])



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading venue details...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/venues">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Venue Details</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/venues/${venue.id}/usage`}>View Usage</Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
             
            >
              <Edit className="mr-2 h-4 w-4" />
              <Link href={`/admin/venues/editVenue/${venue.id}`}>Edit Venue</Link>
             
            </Button>
          </div>
        </header>
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{venue.name}</CardTitle>
                    <CardDescription>{venue.type}</CardDescription>
                  </div>
                  <Badge
                    variant={venue.status === "active" ? "default" : "secondary"}
                    className={
                      venue.status === "active"
                        ? "bg-green-500/20 text-green-600 hover:bg-green-500/20"
                        : "bg-gray-500/20 text-gray-600 hover:bg-gray-500/20"
                    }
                  >
                    {venue.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                      <p>{venue.description}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p>{venue.address}</p>
                            <p>
                              {venue.city}, {venue.state} {venue.postalCode}
                            </p>
                            <p>{venue.country}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">QR Code Activity</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Total Scans: <strong>{venue.totalScans.toLocaleString()}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Last Scanned: <strong>{new Date(venue.lastQrScanned).toLocaleString()}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Times</h3>
                      <div className="flex flex-wrap gap-2">
                        {venue.popularTimes.map((time: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="subscription" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Plan</h3>
                        <Badge
                          variant="outline"
                          className={
                            venue.subscription === "Enterprise"
                              ? "border-blue-500 text-blue-500"
                              : venue.subscription === "Professional"
                                ? "border-pink-500 text-pink-500"
                                : "border-purple-500 text-purple-500"
                          }
                        >
                          {venue.subscription}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Start Date</h3>
                        <p>{new Date(venue.subscriptionStartDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Payment</h3>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(venue.lastPayment).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Payment Due</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(venue.nextPaymentDue).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Person</h3>
                        <p>{venue.contactName}</p>
                        <p className="text-sm text-muted-foreground">{venue.contactPosition}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${venue.contactEmail}`} className="text-primary hover:underline">
                              {venue.contactEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${venue.contactPhone}`} className="hover:underline">
                              {venue.contactPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Online Presence</h3>
                      <div className="space-y-2">
                        {venue.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={venue.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {venue.website}
                            </a>
                          </div>
                        )}
                        {venue.socialMedia &&
                          Object.entries(venue.socialMedia).map(([platform, handle]: [string, string]) => (
                            <div key={platform} className="flex items-center gap-2">
                              <span className="text-muted-foreground capitalize">{platform}:</span>
                              <span>@{handle}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex justify-between w-full">
                  <span>Created: {new Date(venue.createdAt).toLocaleDateString()}</span>
                  <span>Last Updated: {new Date(venue.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Visitors</span>
                    <span className="text-xl font-bold">{venue.activeVisitors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Visitors</span>
                    <span className="text-xl font-bold">{venue.totalVisitors.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Stay</span>
                    <span className="text-xl font-bold">{venue.averageStay}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <QrCode className="h-32 w-32 text-gray-900" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download QR Code
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      
      
      <Toaster />
    </div>
  )
}