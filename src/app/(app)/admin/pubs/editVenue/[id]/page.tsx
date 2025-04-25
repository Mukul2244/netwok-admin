
        
        // // Mock data for development
        // const venueData = {
        //   id: params.id,
        //   name: "The Golden Pub",
        //   type: "Pub",
        //   address: "123 Main St",
        //   city: "London",
        //   state: "Greater London",
        //   postalCode: "EC1V 1NE",
        //   country: "UK",
        //   description: "A traditional British pub with a modern twist.",
        //   subscription: "Professional",
        //   status: "Active",
        //   contactName: "John Smith",
        //   contactPosition: "Manager",
        //   contactEmail: "john@goldenpub.com",
        //   contactPhone: "+44 123 456 7890",
        //   website: "https://goldenpub.com",
        //   updatedAt: new Date().toISOString(),
        // };
        







"use client";

import React, { useState, useEffect } from "react";
import { useRouter} from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";


interface Venue {
//   id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
  subscription: string;
  status: string;
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  updatedAt?: string;
}

export default function EditVenuePage({ params }: { params: { id: string } }) {
//   const {id}=useParams()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    description: "",
    subscription: "Professional",
    status: "Active",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
  });

  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoadingVenue(true);
      try {
    //     // Correctly unwrap params using React.use()
       
        
    //     // Fetch venue data using the unwrapped ID
    //     const response = await fetch(`/api/venues/${id}`);
        
    //     if (!response.ok) {
    //       throw new Error(`Error fetching venue: ${response.status}`);
    //     }
        
    //     const venueData = await response.json();

          // Mock data for development
        const venueData = {
        //   id:id,
          name: "The Golden Pub",
          type: "Pub",
          address: "123 Main St",
          city: "London",
          state: "Greater London",
          postalCode: "EC1V 1NE",
          country: "UK",
          description: "A traditional British pub with a modern twist.",
          subscription: "Professional",
          status: "Active",
          contactName: "John Smith",
          contactPosition: "Manager",
          contactEmail: "john@goldenpub.com",
          contactPhone: "+44 123 456 7890",
          website: "https://goldenpub.com",
          updatedAt: new Date().toISOString(),
        };
        


        
        setVenue(venueData);
        setFormData({
          name: venueData.name || "",
          type: venueData.type || "",
          address: venueData.address || "",
          city: venueData.city || "",
          state: venueData.state || "",
          postalCode: venueData.postalCode || "",
          country: venueData.country || "",
          description: venueData.description || "",
          subscription: venueData.subscription || "Professional",
          status: venueData.status || "Active",
          contactName: venueData.contactName || "",
          contactPosition: venueData.contactPosition || "",
          contactEmail: venueData.contactEmail || "",
          contactPhone: venueData.contactPhone || "",
          website: venueData.website || "",
        });
      } catch (error) {
        console.error("Error fetching venue:", error);
        toast({
          title: "Error loading venue",
          description: "Could not load venue information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingVenue(false);
      }
    };

    fetchVenue();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
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
      // Get the unwrapped params to use the correct ID
     
      // await api.put(`/superuser/venues/${id}`, formData);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Venue updated successfully",
        description: `${formData.name} has been updated.`,
      });
      
      // Navigate back to venues list
      router.push("/admin/pubs");
    } catch (error) {
      console.error("Error updating venue:", error);
      toast({
        title: "Error updating venue",
        description: "There was a problem updating the venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/pubs");
  };

  if (isLoadingVenue) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading venue information...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Venue Not Found</CardTitle>
            <CardDescription>
              The venue you&apos;re looking for doesn&apos;t exist or you may not have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/pubs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Venues
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={handleCancel} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Venues
        </Button>
        <h1 className="text-3xl font-bold">Edit Venue</h1>
        <p className="text-muted-foreground">Make changes to venue information</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Venue Name</Label>
                    <Input
                      id="name"
                      placeholder="Venue name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Venue Type</Label>
                    <Input
                      id="type"
                      placeholder="e.g. Pub, Restaurant, Cafe"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Venue description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="Postal code"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      placeholder="Contact person's name"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPosition">Position</Label>
                    <Input
                      id="contactPosition"
                      placeholder="e.g. Manager, Owner"
                      value={formData.contactPosition}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="Email address"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      placeholder="Phone number"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="Website URL"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-3">
                  <Label>Subscription Plan</Label>
                  <RadioGroup
                    value={formData.subscription}
                    onValueChange={(value) => handleRadioChange("subscription", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Starter" id="starter" />
                      <Label htmlFor="starter">Starter ($29/month)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Professional" id="professional" />
                      <Label htmlFor="professional">Professional ($79/month)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Enterprise" id="enterprise" />
                      <Label htmlFor="enterprise">Enterprise ($199/month)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label>Account Status</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => handleRadioChange("status", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Active" id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Inactive" id="inactive" />
                      <Label htmlFor="inactive">Inactive</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}