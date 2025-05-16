"use client"

import { useState, useEffect ,useRef} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { use } from 'react';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { Venue } from "@/interfaces/ViewVenue";
import { Activity } from "@/interfaces/ViewVenue";


// Mock data for popular times (not in API)
const getPopularTimes = () => {
  return ["Friday 7pm-10pm", "Saturday 8pm-12am", "Sunday 2pm-6pm"]
}

export default function VenueDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = use(params);
  const router=useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [popularTimes, setPopularTimes] = useState<string[]>([]);
  const qrRef = useRef<SVGSVGElement | null>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [qrCodeNumber,setQrCodeNumber]=useState("")

  const fetchVenueDetails = async () => {
    try {
      const response = await api.get(`/venues/${venueId}/`);
      setVenue(response.data);
      console.log(response.data,"-------------------")
      if(response.data.qr_settings){
      setQrCodeNumber(response.data.qr_settings.var_id)
      setRedirectUrl(
        `https://users.netwok.app/register?restaurantId=${venueId}&qrCodeNumber=${response.data.qr_settings.var_id}`
      );
    }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching venue data:", error);
      setError("Failed to load venue details. Please try again later.");
      setLoading(false);
    }
  }


  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      const imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      a.setAttribute("download", "restaurant-qr-code.png");
      a.setAttribute("href", imgURI);
      a.click();
    };

    image.src = url;
  };

  const fetchCurrentActivity = async () => {
    try {
      const response = await api.get(`/su/venue/${venueId}/visitor-status/`);
      setActivity(response.data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      // Don't set the main error state since this is not critical
      // Just leave activity as null
    }
  }

  useEffect(() => {
    if (venueId) {
      fetchVenueDetails()
      fetchCurrentActivity()
      setPopularTimes(getPopularTimes())
    }
  }, [venueId])

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-6">{error}</p>
          <Button asChild>
            <Link href="/admin/venues">Back to Venues</Link>
          </Button>
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

  // Safe formatter for dates - handles invalid inputs gracefully
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return `Invalid Date,${e}`;
    }
  }

  // Calculate next payment date safely
  let formattedDateLast = "N/A";
  let formattedDateNext = "N/A";

  if (venue.payment_details && venue.payment_details.payment_date) {
    try {
      const lastPaymentDate = new Date(venue.payment_details.payment_date);
      const nextYearDate = new Date(lastPaymentDate);
      nextYearDate.setFullYear(lastPaymentDate.getFullYear() + 1);

      formattedDateLast = lastPaymentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      formattedDateNext = nextYearDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting dates:", e);
      // Keep the default N/A values
    }
  }

  // Format amount safely
  const formatAmount = (amountStr: string | undefined | null) => {
    if (!amountStr) return "N/A";
    try {
      return `₹ ${parseFloat(amountStr).toLocaleString()}`;
    } catch (e) {
      return `N/A,${e}`;
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.back()}>
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
                    <CardTitle className="text-2xl">{venue.name || "Unnamed Venue"}</CardTitle>
                    <CardDescription>{venue.venue_type || "Type not specified"}</CardDescription>
                  </div>
                  <Badge
                    variant={venue.is_active ? "default" : "secondary"}
                    className={
                      venue.is_active
                        ? "bg-green-500/20 text-green-600 hover:bg-green-500/20"
                        : "bg-gray-500/20 text-gray-600 hover:bg-gray-500/20"
                    }
                  >
                    {venue.is_active ? "Active" : "Inactive"}
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
                      <p>{venue.description || "No description available"}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                        {venue.address ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p>{venue.address.address || "Address not available"}</p>
                              <p>
                                {venue.address.city || "City not available"}, 
                                {venue.address.state || "State not available"} 
                                {venue.address.postal_code ? venue.address.postal_code : ""}
                              </p>
                              <p>{venue.address.country || "Country not available"}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Address information not available</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">QR Code Activity</h3>
                        {venue.business_details && venue.qr_settings ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <QrCode className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Total Scans: <strong>{venue.business_details.total_qr_scanned?.toLocaleString() || "0"}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                QR Code Generated: <strong>{venue.qr_settings.var_id_gen_time ? 
                                  new Date(venue.qr_settings.var_id_gen_time).toLocaleString() : "Not available"}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                QR Code Expires: <strong>{venue.qr_settings.var_id_expiry_time ? 
                                  new Date(venue.qr_settings.var_id_expiry_time).toLocaleString() : "Not available"}</strong>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">QR code information not available</p>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Times</h3>
                      {popularTimes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {popularTimes.map((time: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No popular times data available</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="subscription" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Plan</h3>
                        {venue.business_details?.subscription_plan ? (
                          <Badge
                            variant="outline"
                            className={
                              venue.business_details.subscription_plan.toLowerCase() === "enterprise"
                                ? "border-blue-500 text-blue-500"
                                : venue.business_details.subscription_plan.toLowerCase() === "professional"
                                  ? "border-pink-500 text-pink-500"
                                  : "border-purple-500 text-purple-500"
                            }
                          >
                            {venue.business_details.subscription_plan.charAt(0).toUpperCase() + venue.business_details.subscription_plan.slice(1)}
                          </Badge>
                        ) : (
                          <p className="text-muted-foreground">No subscription plan information</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Venue Created Date</h3>
                        <p>{formatDate(venue.date_created)}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Payment</h3>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{formattedDateLast}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Amount</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{venue.payment_details?.payment_amount ? 
                            formatAmount(venue.payment_details.payment_amount) : "N/A"}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Payment Due</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formattedDateNext}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Person</h3>
                        {venue.address?.contact_name ? (
                          <>
                            <p>{venue.address.contact_name}</p>
                            <p className="text-sm text-muted-foreground">{venue.address.position || "Position not specified"}</p>
                          </>
                        ) : (
                          <p className="text-muted-foreground">Contact person not specified</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                        {(venue.address?.business_email || venue.address?.contact) ? (
                          <div className="space-y-2">
                            {venue.address.business_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${venue.address.business_email}`} className="text-primary hover:underline">
                                  {venue.address.business_email}
                                </a>
                              </div>
                            )}
                            {venue.address.contact && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${venue.address.contact}`} className="hover:underline">
                                  {venue.address.contact}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No contact information available</p>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Online Presence</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Official Site:</span>
                          {venue.venue_website ? (
                            <a href={venue.venue_website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                              {venue.venue_website}
                            </a>
                          ) : (
                            <span>Not available</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Facebook:</span>
                          {venue.fb_url ? (
                            <a href={venue.fb_url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                              {venue.fb_url}
                            </a>
                          ) : (
                            <span>Not available</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Instagram:</span>
                          {venue.insta_url ? (
                            <a href={venue.insta_url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                              {venue.insta_url}
                            </a>
                          ) : (
                            <span>Not available</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Twitter:</span>
                          {venue.twitter_url ? (
                            <a href={venue.twitter_url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                              {venue.twitter_url}
                            </a>
                          ) : (
                            <span>Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex justify-between w-full">
                  <span>Created: {formatDate(venue.date_created)}</span>
                  <span>Last Updated: {venue.payment_details?.last_update ? 
                    formatDate(venue.payment_details.last_update) : "N/A"}</span>
                </div>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Active Visitors</span>
                        <span className="text-xl font-bold">{activity.active_visitors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Visitors</span>
                        <span className="text-xl font-bold">{activity.total_visitors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Average Stay</span>
                        <span className="text-xl font-bold">{activity.average_stay}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-muted-foreground">Activity data not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>


<Card>
  <CardHeader>
    <CardTitle>QR Code</CardTitle>
    <CardDescription>
      ID: {venue.qr_settings?.var_id || "Not available"}
    </CardDescription>
  </CardHeader>

  <CardContent className="flex justify-center">
    <div className="bg-white p-4 rounded-lg border">
      <QRCodeSVG
        ref={qrRef}
        value={redirectUrl}
        size={200}
        level="H"
        includeMargin={true}
        
      />
    </div>
  </CardContent>

  <div className="text-center text-2xl font-bold mt-2 text-zinc-700 dark:text-zinc-300">
    {qrCodeNumber}
  </div>

  <CardFooter>
    <Button variant="outline" className="w-full" onClick={downloadQRCode}>
      Download QR Code
    </Button>
  </CardFooter>
</Card>


              {venue.offers && venue.offers.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Offers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {venue.offers.map((offer) => (
                      <div key={offer.id} className="p-3 border rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Token: {offer.token || "N/A"}</span>
                          {offer.time_based && (
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              Time Limited
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{offer.description || "No description"}</p>
                        {offer.time_based && offer.expiry_time && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Expires: {new Date(offer.expiry_time).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}