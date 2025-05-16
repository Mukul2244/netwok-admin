
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from 'react';
import Image from "next/image";
import api from "@/lib/axios";
import {toast} from "sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  MessageSquare, 
  XCircle, 
  Mail, 
  Globe, 
  Calendar, 
  User, 
  MapPin, 
  Users, 
  Gift, 
  Clock, 
  Building, 
  MessageCircle, 
  PhoneCall,
  AlertCircle,
  Table
} from "lucide-react";
import { CustomerDetails } from "@/interfaces/UserProfile";
import { Connection } from "@/interfaces/UserProfile";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: customerId } = use(params);
  const [customerData, setCustomerData] = useState<CustomerDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'venues'>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentConnections, setRecentConnections] = useState<Connection[]>([]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/su/customers/${customerId}/`);
  
      const data = response.data;
      console.log(data, "data--------------------------");
      
      
      const processedData = {
        ...data,
        username: data.username || "user_" + customerId,
        email: data.email || "No email provided",
        gender: data.gender || "Not specified",
        first_name: data.first_name || "User",
        last_name: data.last_name || "",
        status: data.status || "unknown",
        last_active: data.last_active !== undefined ? data.last_active : undefined,

        customer_profile: {
          name: data.customer_profile?.name || `User ${customerId}`,
          one_line_desc: data.customer_profile?.one_line_desc || "No bio available",
          interests: data.customer_profile?.interests || [],
          profile: data.customer_profile?.profile || "",
          doj: data.customer_profile?.doj!= undefined ? data.customer_profile?.doj: undefined,
          address: data.customer_profile?.address || "No address provided"
        },
        venues_visited: data.venues_visited || [],
        top_3_favourite_venues: data.top_3_favourite_venues || [],
        total_venues_visited: data.total_venues_visited || 0,
        recent_activity: data.recent_activity || []
      };
      
      setCustomerData(processedData);
      
      // Set up recent connections based on activity or use defaults
      const connections = data.connections || [
        {
          first_name: "Emily",
          last_name: "Wilson",
          venue_name: "The Golden Pub",
          timestamp: "2023-06-20T18:00:00Z"
        },
        {
          first_name: "Michael",
          last_name: "Chen",
          venue_name: "Brewdog Central",
          timestamp: "2023-06-16T01:45:00Z"
        }
      ];
      
      setRecentConnections(connections);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      setError("Failed to load user data. Please try again later.");
      setLoading(false);
      toast.error("Error loading user details");
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

 
  const handleAccount = async (status:string) => {
    
    try {
      setLoading(true);
      if(status=="active"){
      const res = await api.post(`/su/disable/customer/${customerId}/`);
      toast.success(`${res.data.detail || "User status updated successfully"}`);
      console.log(`Customer ${customerId} disabled`);
      }
      else{
      const res = await api.post(`/su/activate/customer/${customerId}/`);
      toast.success(`${res.data.detail || "User status updated successfully"}`);
      console.log(`Customer ${customerId} enabled`);
      }
      fetchCustomerDetails();
    }
    catch(error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update user status");
    }
    finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString("en-GB", { 
        day: "2-digit",
        month: "2-digit",
        year: "numeric" 
      }).replace(/\//g, '/');
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Error formatting date";
    }
  };
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString("en-GB", { 
        day: "2-digit",
        month: "2-digit",
        year: "numeric" 
      }).replace(/\//g, '/') + ", " + 
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (error) {
      console.error("DateTime formatting error:", error);
      return "Error formatting date/time";
    }
  };

  // Get activity icon based on activity type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'connection':
        return <Users size={18} className="text-purple-500" />;
      case 'venue_visit':
        return <MapPin size={18} className="text-blue-500" />;
      case 'venue_signup':
        return <Edit size={18} className="text-green-500" />; 
      case 'private_chat_message':
        return <MessageCircle size={18} className="text-orange-500" />;
      case 'private_chat_started':
        return <PhoneCall size={18} className="text-indigo-500" />;
      case 'offer_redeemed':
        return <Gift size={18} className="text-pink-500" />;
      case 'table_reservation':
          return <Table size={18} className="text-pink-500" />;
      default:
        return <MessageSquare size={18} className="text-gray-500" />;
    }
  };


  // const handleSendMessage=async()=>{
  //     const res=api.get(`/private/list/`)
  // }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-950 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen dark:bg-gray-950 dark:text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-xl font-semibold mb-2">Error Loading User Data</p>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button 
          onClick={() => fetchCustomerDetails()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen dark:bg-gray-950 dark:text-white">
        <AlertCircle size={48} className="text-amber-500 mb-4" />
        <p className="text-xl font-semibold">User not found</p>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const hasProfile = !!customerData?.customer_profile;
  const hasProfileImage = hasProfile && !!customerData.customer_profile.profile;
  
  return (
    <div className="container mx-auto px-4 py-6 dark:bg-zinc-950 dark:text-white transition-colors duration-200">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">User Details</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push(`/admin/users/${customerId}/userActivity`)}
            className="px-4 py-2 bg-white dark:bg-gray-950 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View Activity
          </button>
          <button 
            onClick={() => router.push(`/edit-user/${customerId}`)}
            className="px-4 py-2 text-white rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Edit size={16} />
            Edit User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-purple-500 bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-200 font-semibold text-xl">
                {hasProfileImage ? (
                  <Image
                    src={customerData.customer_profile.profile}
                    alt="User Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>
                    {(customerData.first_name?.[0] || "?").toUpperCase()}
                    {(customerData.last_name?.[0] || "").toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {customerData.first_name || "Unknown"} {customerData.last_name || ""}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>@{customerData.username || "user_" + customerId}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded
                      ${customerData.status === "inactive"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      }`}
                  >
                    {customerData.status || "unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value as "profile" | "activity" | "venues")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-2">Bio</h3>
                <p className="text-gray-700 dark:text-white">
                  {hasProfile && customerData.customer_profile.one_line_desc 
                    ? customerData.customer_profile.one_line_desc 
                    : "No bio available for this user."
                  }
                </p>
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 justify-between grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Mail size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-white">{customerData.email || "No email available"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-white">
                        {hasProfile && customerData.customer_profile.address 
                          ? customerData.customer_profile.address 
                          : "No address provided"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-2">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <Calendar size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-white">
                        Joined: {hasProfile && customerData.customer_profile.doj 
                          ? formatDate(customerData.customer_profile.doj) 
                          : "Unknown"
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                        <User size={16} className="text-pink-600 dark:text-pink-400" />
                      </div>
                      <span className="text-gray-700 dark:text-white">Gender: {customerData.gender || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 justify-between">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-3">Interests</h3>
                {hasProfile && customerData.customer_profile.interests && customerData.customer_profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {customerData.customer_profile.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-950 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">No interests specified</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-4">Recent Activity</h3>
              {customerData.recent_activity && customerData.recent_activity.length > 0 ? (
                <div className="space-y-6">
                  {customerData.recent_activity
                    .slice(0, 4) // only first 4 activities
                    .map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-2 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          {activity.type === 'venue_visit' && (
                            <p className="font-medium dark:text-white">
                              Visited {activity.venue || "unknown venue"} ({activity.total_visits || 0} times)
                            </p>
                          )}
                          {activity.type === 'venue_signup' && (
                            <p className="font-medium dark:text-white">Signed up at {activity.venue || "unknown venue"}</p>
                          )}
                          {activity.type === 'private_chat_message' && (
                            <p className="font-medium dark:text-white">Sent a message: &quot;{activity.message || "No message content"}&quot;</p>
                          )}
                          {activity.type === 'private_chat_started' && (
                            <p className="font-medium dark:text-white">Started a new private chat</p>
                          )}
                          {activity.type === 'offer_redeemed' && (
                            <p className="font-medium dark:text-white">Redeemed an offer at {activity.venue || "unknown venue"}</p>
                          )}
                           {activity.type === 'table_reservation' && (
                            <p className="font-medium dark:text-white">Reserved a table at {activity.venue || "unknown venue"}</p>
                          )}
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock size={12} />
                            <span>{activity.timestamp ? formatDateTime(activity.timestamp) : "Unknown time"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => router.push(`/admin/users/${customerId}/userActivity`)}
                      className="text-gray-600 dark:text-white bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Clock size={16} />
                      View All Activity
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                  <Clock size={48} className="mb-4 opacity-50" />
                  <p className="text-center mb-2">No recent activity found for this user</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'venues' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-4">Favorite Venues</h3>
                {customerData.top_3_favourite_venues && customerData.top_3_favourite_venues.length > 0 ? (
                  <div className="space-y-4">
                    {customerData.top_3_favourite_venues.map((venue, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                          <Building size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium dark:text-white">{venue.venue_name || "Unknown venue"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">No favorite venues found</p>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-gray-600 dark:text-gray-400 font-bold">Total Venues Visited</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {customerData.total_venues_visited || 0}
                    </p>
                  </div>

                  <button className="text-gray-600 dark:text-white bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                    <MapPin size={16} />
                    View All Venues
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Created: {hasProfile && customerData.customer_profile.doj 
                  ? formatDate(customerData.customer_profile.doj) 
                  : "Unknown"
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Last Active: {customerData.last_active ? formatDateTime(customerData.last_active) : "Unknown"}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <h3 className="text-2xl font-bold mb-4 dark:text-white bg-clip-text ">User Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-500" />
                  <span className="text-gray-600 dark:text-white">Connections</span>
                </div>
                <span className="font-semibold text-lg dark:text-white">{recentConnections?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building size={18} className="text-blue-500" />
                  <span className="text-gray-600 dark:text-white">Venues Visited</span>
                </div>
                <span className="font-semibold text-lg dark:text-white">{customerData.total_venues_visited || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-green-500" />
                  <span className="text-gray-600 dark:text-white">Last Active</span>
                </div>
                <span className="font-normal text-sm dark:text-white">
                  {customerData.last_active ? formatDateTime(customerData.last_active).split(',')[0] : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <h3 className="text-2xl font-bold mb-4 dark:text-white bg-clip-text ">Recent Connections</h3>
            
            {recentConnections && recentConnections.length > 0 ? (
              <div className="space-y-4">
                {recentConnections.map((connection, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-500 bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      {index < 2 ? (
                        <Image 
                          src={`/user-${index + 1}.jpg`}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-purple-700 dark:text-purple-200 font-semibold">
                          {(connection.first_name?.[0] || "?").toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">
                        {connection.first_name || "Unknown"} {connection.last_name || ""}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-white">
                        <Building size={12} />
                        <span>{connection.venue_name || "Unknown venue"}</span>
                        <span>•</span>
                        <Calendar size={12} />
                        <span>{connection.timestamp ? formatDate(connection.timestamp) : "Unknown date"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                <Users size={48} className="mb-4 opacity-50" />
                <p className="text-center mb-2">No connections found</p>
              </div>
            )}
            
            <div className="mt-6">
              <button className="w-full bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2">
                <Users size={16} />
                View All Connections
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <h3 className="text-2xl font-bold mb-4 dark:text-white bg-clip-text ">Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.push(`/edit-user/${customerId}`)}
                className="w-full flex items-center justify-between bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 px-4 py-3 rounded-md transition-colors group">
                <span className="flex items-center gap-2 text-gray-700 dark:text-white">
                  <Edit size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Edit Profile</span>
                </span>
              </button>
              
              <button className="w-full flex items-center justify-between bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 px-4 py-3 rounded-md transition-colors group"
              >
                <span className="flex items-center gap-2 text-gray-700 dark:text-white">
                  <MessageSquare size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Send Message</span>
                </span>
              </button>
              
              <button 
  onClick={() => handleAccount(customerData.status)}

  className="w-full flex items-center justify-between bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 px-4 py-3 rounded-md transition-colors group"
  disabled={loading}
>
  <span className="flex items-center gap-2 text-gray-700 dark:text-white">
    <XCircle 
      size={18} 
      className={`group-hover:scale-110 transition-transform ${
        customerData.status === "inactive" ? "text-green-500" : "text-red-500"
      }`} 
    />
    <span>
      {loading ? "Processing..." : `${customerData.status === "inactive" ? "Enable" : "Disable"} Account`}
    </span>
  </span>
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}