// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { UserInterface } from "@/interfaces/User";
// import api from "@/lib/axios";

// export default function UsersTab() {
//   const [selectedUser, setSelectedUser] = useState<UserInterface[]>([]);
//   const [restaurantId, setRestaurantId] = useState<string | null>(null);

//   // Access localStorage only after the component has mounted
//   useEffect(() => {
//     const storedRestaurantId = localStorage.getItem("restaurantId");
//     if (storedRestaurantId) {
//       setRestaurantId(storedRestaurantId);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (!restaurantId) return;
//       try {
//         const response = await api.get(`/restaurants/${restaurantId}/`);
//         const ids = response.data.customers;
//         const usernames = response.data.customers_usernames;
//         const mergedCustomers = ids.map((id: number, index: number) => ({
//           id: id,
//           username: usernames[index],
//         }));
//         setSelectedUser(mergedCustomers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, [restaurantId]);

//   if (!restaurantId)
//     return (
//       <div className="text-center p-8">
//         <h1 className="text-2xl font-bold text-foreground">
//           Restaurant not found
//         </h1>
//         <p className="text-muted-foreground">
//           Please ensure you have selected a restaurant.
//         </p>
//       </div>
//     );

//   return (
//     <Card className="col-span-4 bg-background shadow-lg rounded-lg overflow-hidden">
//       <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-amber-700 dark:to-orange-800">
//         <CardTitle>User Management</CardTitle>
//         <CardDescription className="text-amber-100 dark:text-amber-200">
//           View and interact with your customers
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="p-6">
//         {selectedUser.length === 0 ? (
//           <div className="flex items-center justify-center h-[400px]">
//             <p className="text-amber-500 dark:text-amber-400 ">No user found</p>
//           </div>
//         ) : (
//           <ScrollArea className="h-[400px] bg-gradient-to-br ">
//             {selectedUser.map((user) => (
//               <div
//                 key={user.id}
//                 className="flex items-center justify-between mb-4 p-4 hover:bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg transition-all duration-300"
//               >
//                 <div className="flex items-center">
//                   <Avatar className="h-12 w-12 border-2 border-zinc-300 dark:border-zinc-700">
//                     <AvatarImage src={``} alt={user.username} />
//                     <AvatarFallback>
//                       {user.username[0]?.toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="ml-4">
//                     <p className="font-semibold text-zinc-800 dark:text-zinc-300">
//                       {user.username}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


















"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserInterface } from "@/interfaces/User";
import api from "@/lib/axios";
import { Search, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UsersTab() {
  const [selectedUser, setSelectedUser] = useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Access localStorage only after the component has mounted
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!restaurantId) return;
      try {
        setIsLoading(true);
        const response = await api.get(`/restaurants/${restaurantId}/`);
        const ids = response.data.customers;
        const usernames = response.data.customers_usernames;
        const mergedCustomers = ids.map((id: number, index: number) => ({
          id: id,
          username: usernames[index],
        }));
        setSelectedUser(mergedCustomers);
        setFilteredUsers(mergedCustomers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [restaurantId]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(selectedUser);
    } else {
      const filtered = selectedUser.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, selectedUser]);

  if (!restaurantId)
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <Users className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-2xl font-bold text-foreground">
          Restaurant not found
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Please ensure you have selected a restaurant before managing users.
        </p>
      </div>
    );

  const renderUserList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-2"></div>
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
          </div>
        </div>
      );
    }
    
    if (filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <Users className="h-12 w-12 text-amber-400 dark:text-amber-500 mb-3" />
          <p className="text-amber-600 dark:text-amber-400 font-medium mb-1">No users found</p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
            {searchQuery ? "Try a different search term" : "Your customer list is currently empty"}
          </p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px]">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between mb-3 p-4 hover:bg-gradient-to-br from-amber-50 to-amber-100 dark:from-zinc-800 dark:to-zinc-800/70 rounded-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-amber-200 dark:border-amber-800 ring-2 ring-amber-100 dark:ring-amber-900 ring-offset-1 group-hover:ring-amber-300 dark:group-hover:ring-amber-700 transition-all">
                <AvatarImage src={``} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                  {user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.username}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Customer ID: {user.id}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
            </Button>
          </div>
        ))}
      </ScrollArea>
    );
  };

  return (
    <Card className="col-span-4 bg-background shadow-lg rounded-lg overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-amber-700 dark:to-orange-800 py-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5" /> 
              User Management
            </CardTitle>
            <CardDescription className="text-amber-100 dark:text-amber-200 mt-1">
              View and interact with your customers
            </CardDescription>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            className="pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
            placeholder="Search users by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {renderUserList()}
      </CardContent>
      <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 py-3 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Total users: {selectedUser.length}
          </p>
          <Button variant="outline" size="sm" className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700">
            Export Users
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}