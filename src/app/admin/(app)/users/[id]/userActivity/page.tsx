
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { use } from "react";
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
  Building,
  Eye,
  UserPlus,
  User,
  MessageCircle,
  BadgeDollarSign,
  CalendarCheck,
  AlertCircle
} from "lucide-react";
import { UserData } from '@/interfaces/UserActivity';
import { Activity } from '@/interfaces/UserActivity';

type FilterOption = 'All Time' | 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days';
type TabOption = 'All' | 'Connections' | 'Visits' | 'Updates' | 'Chats' | 'Offers'| 'Reservations' | 'Venue SignUp';

const UserActivityPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: customerId } = use(params);
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<TabOption>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterOption, setFilterOption] = useState<FilterOption>('All Time');



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/su/customers/${customerId}/`);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }
        
        const data = response.data;
        
        // Validate critical user data fields
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid user data received from server');
        }
        
        // Check for required fields
        if (!data.first_name || !data.last_name) {
          throw new Error('User name information is missing');
        }
        
        // Ensure customer_profile exists
        if (!data.customer_profile) {
          data.customer_profile = {
            name: `${data.first_name} ${data.last_name}`,
            one_line_desc: 'No description available',
            interests: [],
            profile: '',
            current_venue: 0,
            address: '',
            doj: '',
            is_verified: false,
            otp_validated: false, 
            current_table: 0
          };
        }
        
        // Ensure recent_activity array exists
        if (!data.recent_activity || !Array.isArray(data.recent_activity)) {
          data.recent_activity = [];
        }
        
        setUserData(data as UserData);
        setFilteredActivities(data.recent_activity || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [customerId]);
  

  

  useEffect(() => {
    if (userData && userData.recent_activity) {
      try {
        let filtered = [...userData.recent_activity];
        
        if (filterOption !== 'All Time') {
          const currentDate = new Date();
          let daysToSubtract = 0;
          
          switch (filterOption) {
            case 'Last 7 Days':
              daysToSubtract = 7;
              break;
            case 'Last 30 Days':
              daysToSubtract = 30;
              break;
            case 'Last 90 Days':
              daysToSubtract = 90;
              break;
          }
          
          const cutoffDate = new Date();
          cutoffDate.setDate(currentDate.getDate() - daysToSubtract);
          
          filtered = filtered.filter(activity => {
            try {
              // Verify timestamp exists and is valid
              if (!activity.timestamp) return false;
              
              const activityDate = new Date(activity.timestamp);
              if (isNaN(activityDate.getTime())) return false;
              
              return activityDate >= cutoffDate;
            } catch (e) {
              console.warn('Error filtering activity by date:', e);
              return false;
            }
          });
        }
        
        // Apply tab filter
        if (activeTab !== 'All') {
          filtered = filtered.filter(activity => {
            try {
              // Verify type exists
              if (!activity.type) return false;
              
              switch (activeTab) {
                case 'Connections':
                  return activity.type.includes('connected');
                case 'Visits':
                  return activity.type.includes('visit');
                case 'Updates':
                  return activity.type.includes('profile');
                case 'Venue SignUp':
                  return activity.type.includes('venue_signup');
                case 'Chats':
                  return activity.type.includes('chat');
                case 'Offers':
                  return activity.type.includes('offer');
                case 'Reservations':
                  return activity.type.includes('table_reservation');
                default:
                  return true;
              }
            } catch (e) {
              console.warn('Error filtering activity by tab:', e);
              return false;
            }
          });
        }
        
        setFilteredActivities(filtered);
      } catch (error) {
        console.error('Error applying filters:', error);
        setFilteredActivities([]);
      }
    }
  }, [userData, activeTab, filterOption]);



  try {
   

    if (!customerId) {
      throw new Error('Customer ID is missing from parameters');
    }
  } catch (err) {
    return (
      <div className="p-4 text-center dark:text-white text-red-500">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p>Error loading parameters: {err instanceof Error ? err.message : 'Unknown error occurred'}</p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }


  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    setShowFilterDropdown(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-950 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 dark:text-white">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <div className="p-4 text-center text-red-500">Error: {error}</div>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 dark:text-white">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <div className="p-4 text-center dark:text-white text-zinc-700">No user data found</div>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Safely access user data with fallbacks
  const firstName = userData.first_name || 'Unknown';
  const lastName = userData.last_name || 'User';
  const profileDesc = userData.customer_profile?.one_line_desc || 'No description available';
  const profileImage = userData.customer_profile?.profile || '';

  return (
    <div className="h-screen flex flex-col dark:bg-zinc-900 dark:text-zinc-200 bg-white text-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 dark:border-zinc-700 border-zinc-200 border-b">
        <div className="flex items-center space-x-2">
          <button className="dark:text-zinc-400 text-zinc-500" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">User Activity</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-1 px-3 py-2 border rounded-md 
                dark:border-zinc-700 dark:hover:bg-zinc-800 border-zinc-200 hover:bg-zinc-50"
            >
              <Filter size={16} />
              <span>Filter: {filterOption}</span>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 dark:bg-zinc-800 dark:border-zinc-700 bg-white border-zinc-100 border">
                <div className="p-2 border-b dark:border-zinc-700 border-zinc-100 font-medium">Filter by Date</div>
                <div className="py-2">
                  {(['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as FilterOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterChange(option)}
                      className={`block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${filterOption === option ? 'bg-zinc-100 dark:bg-zinc-700 font-medium' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 dark:border-zinc-700 border-zinc-200 border-b">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden dark:bg-zinc-700 bg-zinc-200 flex items-center justify-center">
            {profileImage ? (
              <img 
                src={profileImage}
                alt={firstName}
                className="object-cover"
                onError={(e) => {
                  // Handle image loading error
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = ''; // Clear the src to prevent further errors
                  target.parentElement!.innerHTML = firstName.charAt(0);
                }}
              />
            ) : (
              <span className="text-xl">{firstName.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {firstName} {lastName}&apos;s Activity
            </h2>
            <p className="text-sm dark:text-zinc-400 text-zinc-500">
              {profileDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - Aligned to the right */}
      <div className="flex justify-end dark:border-zinc-700 border-zinc-200 border-b overflow-x-auto">
        {(['All', 'Connections', 'Visits', 'Updates', 'Chats', 'Offers', 'Reservations', 'Venue SignUp'] as TabOption[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-6 py-3 text-center whitespace-nowrap ${
              activeTab === tab 
                ? "dark:text-blue-400 dark:border-blue-400 text-blue-600 border-blue-600 border-b-2" 
                : "dark:text-zinc-400 text-zinc-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto dark:divide-zinc-700 divide-zinc-200 divide-y">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => {
            // Check for required activity properties
            if (!activity || !activity.type || !activity.timestamp) {
              return null; // Skip rendering this activity
            }

            // Safely format date with error handling
            let formattedDate = "Unknown date";
            try {
              if (activity.timestamp) {
                formattedDate = new Date(activity.timestamp).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).replace(',', '');
              }
            } catch (e) {
              console.warn('Error formatting date:', e);
            }

            return (
              <div key={index} className="p-4">
                <div className="flex">
                  {/* Activity Icon */}
                  <div className="mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type.includes("visit")
                          ? "dark:bg-blue-900 dark:text-blue-300 bg-blue-100 text-blue-500"
                          : activity.type.includes("connect")
                          ? "dark:bg-purple-900 dark:text-purple-300 bg-purple-100 text-purple-500"
                          : activity.type.includes("profile")
                          ? "dark:bg-yellow-900 dark:text-yellow-300 bg-yellow-100 text-yellow-500"
                          : activity.type.includes("chat")
                          ? "dark:bg-green-900 dark:text-green-300 bg-green-100 text-green-500"
                          : activity.type.includes("venue_signup")
                          ? "dark:bg-red-900 dark:text-red-300 bg-red-100 text-red-500"
                          : activity.type.includes("table_reservation")
                          ? "dark:bg-cyan-900 dark:text-cyan-300 bg-cyan-100 text-cyan-500"
                          : "dark:bg-orange-900 dark:text-orange-300 bg-orange-100 text-orange-500"
                      }`}
                    >
                      {activity.type.includes("visit") && <Eye className="h-5 w-5" />}
                      {activity.type.includes("connect") && <UserPlus className="h-5 w-5" />}
                      {activity.type.includes("profile") && <User className="h-5 w-5" />}
                      {activity.type.includes("chat") && <MessageCircle className="h-5 w-5" />}
                      {activity.type.includes("offer") && <BadgeDollarSign className="h-5 w-5" />}
                      {activity.type.includes("venue_signup") && <Building className="h-5 w-5" />}
                      {activity.type.includes("table_reservation") && <CalendarCheck className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        {activity.type === "venue_visit" && (
                          <div className="font-medium">Visited {activity.venue || 'Unknown venue'}</div>
                        )}
                        {activity.type === "connected" && (
                          <div>
                            <div className="font-medium">Connected with {activity.user || 'someone'}</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">at {activity.venue || 'a venue'}</div>
                          </div>
                        )}
                        {activity.type.includes('profile') && (
                          <div>
                            <div className="font-medium">Updated profile</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">{activity.details || 'Profile details updated'}</div>
                          </div>
                        )}
                        {activity.type.includes('chat') && (
                          <div>
                            <div className="font-medium">Started a private chat</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">with {activity.with || 'another user'}</div>
                          </div>
                        )}
                        {activity.type === 'offer_redeemed' && (
                          <div>
                            <div className="font-medium">Redeemed an offer</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">{activity.offer || 'An offer'} at {activity.venue || 'a venue'}</div>
                          </div>
                        )}
                        {activity.type === 'venue_signup' && (
                          <div>
                            <div className="font-medium">Venue SignUp</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">
                              {activity.joined_at ? 
                                `On ${new Date(activity.joined_at).toLocaleDateString()}` : 
                                'Recently'} at {activity.venue || 'a venue'}
                            </div>
                          </div>
                        )}
                        {activity.type === 'table_reservation' && (
                          <div>
                            <div className="font-medium">Table Reservation</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">
                              {activity.reservation_time ? 
                                `On ${new Date(activity.reservation_time).toLocaleDateString()}` : 
                                'Recently'} at {activity.venue || 'a venue'}
                            </div>
                          </div>
                        )}
                        {/* Default case for unknown activity types */}
                        {!['venue_visit', 'connected', 'offer_redeemed', 'venue_signup', 'table_reservation'].includes(activity.type) && 
                         !activity.type.includes('profile') && !activity.type.includes('chat') && (
                          <div>
                            <div className="font-medium">Activity recorded</div>
                            <div className="text-sm dark:text-zinc-400 text-zinc-500">Type: {activity.type}</div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm dark:text-zinc-400 text-zinc-500">
                        {formattedDate}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activity.type === "venue_visit" && (
                      <div className="mt-2">
                        <button
                          className="px-3 py-1 text-sm rounded-md border 
                            bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                            dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
                          onClick={() => {
                            // Safely handle potential missing venue_id
                            const venueId = activity.venue_id || '';
                            if (venueId) {
                              router.push(`/admin/venues/${venueId}`);
                            } else {
                              alert('Venue ID is missing');
                            }
                          }}
                        >
                          View Venue
                        </button>
                      </div>
                    )}
                    {activity.type === "connected" && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          className="px-3 py-1 text-sm rounded-md border 
                            text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                            dark:text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          onClick={() => {
                            // Safely handle potential missing user_id
                            const userId = activity.user_id || '';
                            if (userId) {
                              router.push(`/admin/users/${userId}`);
                            } else {
                              alert('User ID is missing');
                            }
                          }}
                        >
                          View User
                        </button>
                        <button
                          className="px-3 py-1 text-sm rounded-md border 
                                   text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                                   dark:text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          onClick={() => {
                            // Safely handle potential missing venue_id
                            const venueId = activity.venue_id || '';
                            if (venueId) {
                              router.push(`/admin/venues/${venueId}`);
                            } else {
                              alert('Venue ID is missing');
                            }
                          }}
                        >
                          View Venue
                        </button>
                      </div>
                    )}
                    {activity.type.includes('chat') && (
                      <div className="mt-2">
                        <button
                          className="px-3 py-1 text-sm rounded-md border 
                                   text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                                   dark:text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          onClick={() => {
                            // Safely handle potential missing chat_id
                            const chatId = activity.chat_id || '';
                            if (chatId) {
                              router.push(`/admin/chats/${chatId}`);
                            } else {
                              alert('Chat ID is missing');
                            }
                          }}
                        >
                          Open Chat
                        </button>
                      </div>
                    )}
                    {activity.type.includes('offer') && (
                      <div className="mt-2">
                        <button
                          className="px-3 py-1 text-sm rounded-md border 
                                   text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                                   dark:text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          onClick={() => {
                            // Safely handle potential missing offer_id
                            const offerId = activity.offer_id || '';
                            if (offerId) {
                              router.push(`/admin/offers/${offerId}`);
                            } else {
                              alert('Offer ID is missing');
                            }
                          }}
                        >
                          View Offer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>No activities found for the selected filters.</p>
            {activeTab !== 'All' && (
              <button
                onClick={() => setActiveTab('All')}
                className="mt-4 px-3 py-1 text-sm rounded-md border 
                         text-zinc-700 border-zinc-200 hover:bg-zinc-50 
                         dark:text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                Show All Activities
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityPage;