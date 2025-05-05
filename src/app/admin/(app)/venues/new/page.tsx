"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function NewVenuePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    venueName: "",
    venueType: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    description: "",
    subscriptionPlan: "professional",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: "",
    billingAddress: "",
    paymentMethod: "",
    status: "active",
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("venue-", "").replace("contact-", "")]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real application, you would send this data to your API
      // For now, we'll simulate a successful creation
      console.log("Creating venue with data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success toast
      toast({
        title: "Venue created successfully",
        description: `${formData.venueName} has been added to the system.`,
        variant: "default",
      });

      // Redirect to venues list
      router.push("/admin/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
      toast({
        title: "Error creating venue",
        description:
          "There was a problem creating the venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-xl font-semibold">Create New Venue</h1>
            </div>
          </div>
        </header>
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="venue-details" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="venue-details">Venue Details</TabsTrigger>
                <TabsTrigger value="contact-details">
                  Contact Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="venue-details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                    <CardDescription>
                      Enter the basic information about the venue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="venue-name">Venue Name</Label>
                        <Input
                          id="venue-name"
                          placeholder="e.g. The Golden Pub"
                          required
                          value={formData.venueName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue-type">Venue Type</Label>
                        <Input
                          id="venue-type"
                          placeholder="e.g. Pub, Restaurant, Cafe"
                          required
                          value={formData.venueType}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue-address">Address</Label>
                      <Textarea
                        id="venue-address"
                        placeholder="Full address of the venue"
                        required
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="venue-city">City</Label>
                        <Input
                          id="venue-city"
                          placeholder="e.g. London"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue-state">State/Province</Label>
                        <Input
                          id="venue-state"
                          placeholder="e.g. England"
                          required
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue-postalCode">Postal Code</Label>
                        <Input
                          id="venue-postalCode"
                          placeholder="e.g. SW1A 1AA"
                          required
                          value={formData.postalCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue-description">Description</Label>
                      <Textarea
                        id="venue-description"
                        placeholder="Brief description of the venue"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subscription Plan</Label>
                      <RadioGroup
                        value={formData.subscriptionPlan}
                        onValueChange={(value) =>
                          handleRadioChange("subscriptionPlan", value)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="starter" id="starter" />
                          <Label htmlFor="starter">Starter ($29/month)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="professional"
                            id="professional"
                          />
                          <Label htmlFor="professional">
                            Professional ($79/month)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="enterprise" id="enterprise" />
                          <Label htmlFor="enterprise">
                            Enterprise ($199/month)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact-details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Enter the contact details for the venue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Contact Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-name"
                            className="pl-10"
                            placeholder="e.g. John Smith"
                            required
                            value={formData.contactName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-position">Position</Label>
                        <Input
                          id="contact-position"
                          placeholder="e.g. Manager, Owner"
                          required
                          value={formData.contactPosition}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-email"
                            type="email"
                            className="pl-10"
                            placeholder="e.g. john@example.com"
                            required
                            value={formData.contactEmail}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-phone"
                            className="pl-10"
                            placeholder="e.g. +44 123 456 7890"
                            required
                            value={formData.contactPhone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billing-address">Billing Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="billing-address"
                          className="pl-10"
                          placeholder="Billing address (if different from venue address)"
                          value={formData.billingAddress}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              billingAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="payment-method"
                          className="pl-10"
                          placeholder="Credit card or bank details"
                          required
                          value={formData.paymentMethod}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <RadioGroup
                        value={formData.status}
                        onValueChange={(value) =>
                          handleRadioChange("status", value)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inactive" id="inactive" />
                          <Label htmlFor="inactive">Inactive</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const element = document.querySelector(
                            '[data-value="venue-details"]'
                          ) as HTMLElement;
                          element?.click();
                        }}
                      >
                        Previous
                      </Button>

                      <Button variant="default" className="ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>Processing...</>
                        ) : (
                          <div className="flex items-center">
                            <Save className=" mr-2 h-4 w-4" />
                            Create Venue
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
