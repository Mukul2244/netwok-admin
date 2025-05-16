"use client"

import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Filter, ChevronDown, CheckIcon } from "lucide-react";
import {toast} from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";

interface CustomerProfile {
  doj: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  customer_profile: CustomerProfile;
  first_name: string;
  last_name: string;
  status: string;
  last_active: string;
}

// Filter types
type FilterType = 'all' | 'active' | 'inactive' | 'last7days' | 'last30days' | 'last90days';

const UserManagement = () => {
  const router=useRouter();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterLabel, setFilterLabel] = useState("All Users");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/su/customers/');
      // Simulate last_active dates since they aren't provided
      const customersWithActivity = (response.data.results || []).map((customer: User) => ({
        ...customer,
        last_active: getRandomLastActive(),
        // Ensure status is populated for filtering
        status: customer.status || (Math.random() > 0.2 ? "active" : "inactive")
      }));
      setCustomers(customersWithActivity);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (customerId: number, currentStatus: string) => {
    try {
      if (currentStatus === "active") {
        // Call disable API
        const res=await api.post(`/su/disable/customer/${customerId}/`)

        toast(`${res.data.detail}`)
        console.log(`Customer ${customerId} disabled`)
      } else {
        // Call enable API
        const res=await api.post(`/su/activate/customer/${customerId}/`)
        toast(`${res.data.detail}`)
        console.log(`Customer ${customerId} enabled`)
      }
      fetchCustomers()
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Mock data for last active (since it's not in the API response)
  const getRandomLastActive = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
  };

  

  // Apply filters to customers
  const applyFilters = (customers: User[]) => {
    const now = new Date();
    
    return customers.filter(customer => {
      // First apply search term filter
      const matchesSearch = 
        (customer.first_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (customer.last_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (customer.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Then apply the selected filter
      switch (activeFilter) {
        case 'all':
          return true;
        case 'active':
          return customer.status === "active";
        case 'inactive':
          return customer.status === "inactive";
        case 'last7days': {
          const joinDate = customer.customer_profile?.doj 
            ? new Date(customer.customer_profile.doj) 
            : null;
          if (!joinDate) return false;
          const diffTime = Math.abs(now.getTime() - joinDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }
        case 'last30days': {
          const joinDate = customer.customer_profile?.doj 
            ? new Date(customer.customer_profile.doj) 
            : null;
          if (!joinDate) return false;
          const diffTime = Math.abs(now.getTime() - joinDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        }
        case 'last90days': {
          const joinDate = customer.customer_profile?.doj 
            ? new Date(customer.customer_profile.doj) 
            : null;
          if (!joinDate) return false;
          const diffTime = Math.abs(now.getTime() - joinDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 90;
        }
        default:
          return true;
      }
    });
  };

  const filteredCustomers = applyFilters(customers);

  // Handle filter selection
  const handleFilterSelect = (filter: FilterType, label: string) => {
    setActiveFilter(filter);
    setFilterLabel(label);
    setFilterMenuOpen(false);
  };

  // Check if a filter is active
  const isFilterActive = (filter: FilterType) => activeFilter === filter;

  

  return (
    <div className="min-h-screen w-full p-6 bg-gray-50 dark:bg-zinc-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        {/* <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button> */}
      </div>

      <Card className="w-full h-[calc(100vh-150px)] overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">All Users</CardTitle>
          <p className="text-sm text-gray-500">Manage all registered users in the system</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-80">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3"
              />
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <Filter className="h-4 w-4" />
                {filterLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {filterMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
                  <div className="p-2 font-medium border-b">Filter by</div>
                  <div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                      onClick={() => handleFilterSelect('all', 'All Users')}
                    >
                      <span>All Users</span>
                      {isFilterActive('all') && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                      onClick={() => handleFilterSelect('active', 'Active Users')}
                    >
                      <span>Active Users</span>
                      {isFilterActive('active') && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                      onClick={() => handleFilterSelect('inactive', 'Inactive Users')}
                    >
                      <span>Inactive Users</span>
                      {isFilterActive('inactive') && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <div className="p-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Join Date</div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer pl-4 flex items-center justify-between"
                      onClick={() => handleFilterSelect('last7days', 'Last 7 days')}
                    >
                      <span>Last 7 days</span>
                      {isFilterActive('last7days') && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer pl-4 flex items-center justify-between"
                      onClick={() => handleFilterSelect('last30days', 'Last 30 days')}
                    >
                      <span>Last 30 days</span>
                      {isFilterActive('last30days') && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <div 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer pl-4 flex items-center justify-between"
                      onClick={() => handleFilterSelect('last90days', 'Last 90 days')}
                    >
                      <span>Last 90 days</span>
                      {isFilterActive('last90days') && <CheckIcon className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">Loading...</td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">No users found</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">{customer.first_name} {customer.last_name}</td>
                      <td className="py-3 px-4">{customer.username || "unknown"}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{customer.customer_profile?.doj ? formatDate(customer.customer_profile.doj): "-"}</td>
                      <td className="py-3 px-4">{customer.last_active}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${customer.status === "active" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {customer.status === "active" ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/users/${customer.id}/userProfile`)}>View profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/users/${customer.id}/userActivity`)}>View activity</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
  className={customer.status === "active" ? "text-red-600" : "text-green-600"}
  onClick={() => handleStatusToggle(customer.id, customer.status)}
>
  {customer.status === "active" ? "Disable Account" : "Enable Account"}
</DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredCustomers.length} of {customers.length} users
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;