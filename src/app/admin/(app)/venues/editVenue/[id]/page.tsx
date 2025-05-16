"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";
import { use } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Venue } from "@/interfaces/EditVenue";


export default function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: venueId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    venue_type: "",
    description: "",
    capacity: 0,
    
    // Address info
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    
    // Contact info
    contact_name: "",
    position: "",
    business_email: "",
    contact: "",
    venue_webiste: "",
    
    // Social media
    insta_url: "",
    fb_url: "",
    twitter_url: "",
    
    // Settings
    subscription_plan: "professional",
    is_active: true,
    require_otp: true,
    
    // IDs for nested objects
    address_id: 0,
    business_details_id: 0
  });

  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoadingVenue(true);
      try {
        const response = await api.get(`/venues/${venueId}/`);
        
        if (response.status !== 200) {
          throw new Error(`Error fetching venue: ${response.status}`);
        }
        
        const venueData = response.data;
        setVenue(venueData);
        
        // Map API response to form data
        setFormData({
          name: venueData.name || "",
          venue_type: venueData.venue_type || "",
          description: venueData.description || "",
          capacity: venueData.capacity || 0,
          
          // Address info
          address: venueData.address?.address || "",
          city: venueData.address?.city || "",
          state: venueData.address?.state || "",
          postal_code: venueData.address?.postal_code?.toString() || "",
          country: venueData.address?.country || "",
          
          // Contact info
          contact_name: venueData.address?.contact_name || "",
          position: venueData.address?.position || "",
          business_email: venueData.address?.business_email || "",
          contact: venueData.address?.contact || "",
          venue_webiste: venueData.venue_webiste || "",
          
          // Social media
          insta_url: venueData.insta_url || "",
          fb_url: venueData.fb_url || "",
          twitter_url: venueData.twitter_url || "",
          
          // Settings
          subscription_plan: venueData.business_details?.subscription_plan || "professional",
          is_active: venueData.is_active,
          require_otp: venueData.require_otp,
          
          // Store IDs for nested objects
          address_id: venueData.address?.id || 0,
          business_details_id: venueData.business_details?.id || 0
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
  }, [venueId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value === "" ? 0 : parseInt(value, 10),
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    
      const form = new FormData();

      form.append("name", formData.name);
      form.append("venue_type", formData.venue_type);
      form.append("capacity", formData.capacity.toString());
      form.append("description", formData.description);
      form.append("require_otp", String(formData.require_otp));
      form.append("is_active", String(formData.is_active));
      form.append("venue_webiste", formData.venue_webiste);
      form.append("insta_url", formData.insta_url);
      form.append("fb_url", formData.fb_url);
      form.append("twitter_url", formData.twitter_url);
      
      form.append("address.address", formData.address);
      form.append("address.city", formData.city);
      form.append("address.state", formData.state);
      form.append("address.postal_code", formData.postal_code.toString());
      form.append("address.country", formData.country);
      form.append("address.contact", formData.contact);
      form.append("address.business_email", formData.business_email);
      form.append("address.contact_name", formData.contact_name);
      form.append("address.position", formData.position);
      
      form.append("business_details.subscription_plan", formData.subscription_plan);
      

      // First try the PATCH request
      const res = await api.patch(`/venues/${venueId}/`, form
      );

      console.log("Venue update response:", res);
      
      toast({
        title: "Venue updated successfully",
        description: `${formData.name} has been updated.`,
      });
      
      // Navigate back to venues list
      router.push("/admin/venues");
    } catch (error) {
      console.error("Error updating venue:", error);
      
     
     
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/venues");
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
            <Button onClick={() => router.push("/admin/venues")}>
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
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
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
                    <Label htmlFor="venue_type">Venue Type</Label>
                    <Input
                      id="venue_type"
                      placeholder="e.g. Pub, Restaurant, Cafe"
                      value={formData.venue_type}
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
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Venue capacity"
                    value={formData.capacity || ""}
                    onChange={handleNumberChange}
                    required
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
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      placeholder="Postal code"
                      value={formData.postal_code}
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
                    <Label htmlFor="contact_name">Contact Name</Label>
                    <Input
                      id="contact_name"
                      placeholder="Contact person's name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="e.g. Manager, Owner"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="business_email">Email</Label>
                    <Input
                      id="business_email"
                      type="email"
                      placeholder="Email address"
                      value={formData.business_email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone</Label>
                    <Input
                      id="contact"
                      placeholder="Phone number"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="venue_webiste">Website</Label>
                  <Input
                    id="venue_webiste"
                    placeholder="Website URL"
                    value={formData.venue_webiste}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="social" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="insta_url">Instagram URL</Label>
                  <Input
                    id="insta_url"
                    placeholder="Instagram profile URL"
                    value={formData.insta_url}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fb_url">Facebook URL</Label>
                  <Input
                    id="fb_url"
                    placeholder="Facebook page URL"
                    value={formData.fb_url}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    placeholder="Twitter profile URL"
                    value={formData.twitter_url}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-3">
                  <Label>Subscription Plan</Label>
                  <RadioGroup
                    value={formData.subscription_plan}
                    onValueChange={(value) => handleRadioChange("subscription_plan", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="starter" id="starter" />
                      <Label htmlFor="starter">Starter ($29/month)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional">Professional ($79/month)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enterprise" id="enterprise" />
                      <Label htmlFor="enterprise">Enterprise ($199/month)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label>Venue Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Require OTP for Login</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_otp"
                      checked={formData.require_otp}
                      onCheckedChange={(checked) => handleSwitchChange("require_otp", checked)}
                    />
                    <Label htmlFor="require_otp">Enable OTP Authentication</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end gap-4 ">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} variant="outline">
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
