


"use client"

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { 
  Building2, 
  CheckCircle2, 
  MessageSquare, 
  QrCode, 
  Clock, 
  Send, 
  
} from "lucide-react";


type Restaurant = {
  id: number;
  name: string;
  var_id: string;
};

// type Visitor = {
//   id: number;
//   name: string;
//   table: string;
//   time: string;
// };

// type Message = {
//   id: number;
//   name: string;
//   table: string;
//   message: string;
//   time: string;
//   isNew: boolean;
// };

type ChatMessage = {
  text: string;
  isCustomer: boolean;
  time: string;
};


// Utility function
const safeParseJSON = (key: string) => {

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

// Mock data for demonstration
const visitors = [
  { id: 1, name: "Alex Johnson", table: "Table 5", time: "25 min" },
  { id: 2, name: "Maria Garcia", table: "Table 8", time: "12 min" },
  { id: 3, name: "James Wilson", table: "Table 3", time: "45 min" },
  { id: 4, name: "Sarah Brown", table: "Bar", time: "5 min" }
];

const messages = [
  { id: 1, name: "Alex Johnson", table: "Table 5", message: "Could we get some water please?", time: "2 min ago", isNew: true },
  { id: 2, name: "Maria Garcia", table: "Table 8", message: "Is the kitchen still open for dessert orders?", time: "5 min ago", isNew: false },
  { id: 3, name: "James Wilson", table: "Table 3", message: "We're ready for the check when you have a moment.", time: "10 min ago", isNew: false }
];

const mockChats: Record<string, ChatMessage[]> = {
  "Alex Johnson": [
    { text: "Hello, could we get some water please?", isCustomer: true, time: "2:30 PM" },
    { text: "Of course! I'll bring that right away.", isCustomer: false, time: "2:31 PM" },
    { text: "Thank you!", isCustomer: true, time: "2:32 PM" }
  ]
};


export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
// const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
// const [messages, setMessages] = useState<Message[]>(mockMessages);
const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [showRestaurantSelector, setShowRestaurantSelector] = useState(false);

  const fetchRestaurants = async (userId: string) => {
    try {
      const response = await api.get(`/restaurants/?owner=${userId}`);
      setRestaurants(response.data);

      const restaurantId = localStorage.getItem("restaurantId");
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");

      if (restaurantId && qrCodeNumber) {
        const selectedRest = response.data.find((r: Restaurant) => r.id.toString() === restaurantId);

        if (selectedRest) {
          setSelectedRestaurant(selectedRest);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      // Fallback to mock data if API fails
      
    }
  };

  useEffect(() => {
    const user = safeParseJSON("user");
    if (user && user.id) {
      fetchRestaurants(user.id.toString());
    } else {
      // Fallback to mock data for demonstration
    
      // Check if there's a selected restaurant in localStorage
      const savedRestaurantId = localStorage.getItem("restaurantId");
      if (savedRestaurantId) {
        const restaurant = restaurants.find(r => r.id.toString() === savedRestaurantId);
        if (restaurant) {
          setSelectedRestaurant(restaurant);
        }
      }
    }
  },[restaurants]);

  const handleSelectRestaurant = (restaurant:Restaurant) => {
    try {
      localStorage.setItem("restaurantId", restaurant.id.toString());
      localStorage.setItem("qrCodeNumber", restaurant.var_id.toString());
      setSelectedRestaurant(restaurant);
      setShowRestaurantSelector(false);
    } catch (error) {
      console.error("Error saving restaurant selection:", error);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && selectedChat) {
      // In a real app, you would send this to an API
      setCurrentMessage("");
    }
  };

  const renderRestaurantSelector = () => (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-foreground">🍽️ Your Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => {
          const isSelected = selectedRestaurant && selectedRestaurant.id === restaurant.id;
          return (
            <div
              key={restaurant.id}
              className={`relative p-5 rounded-xl border transition-all duration-300 shadow-sm cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400"
                  : "border-gray-200 hover:shadow-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
              }`}
              onClick={() => handleSelectRestaurant(restaurant)}
            >
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-500 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">
                  {restaurant.name}
                </h2>
                {isSelected && (
                  <CheckCircle2 className="text-green-500 dark:text-green-400 ml-auto" />
                )}
              </div>
              <button
                className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                }`}
              >
                {isSelected ? "Selected" : "Select Restaurant"}
              </button>
            </div>
          );
        })}
      </div>
      {restaurants.length === 0 && (
        <div className="text-center p-10 text-gray-500 dark:text-zinc-400">
          No restaurants found. Please contact admin.
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Restaurant Dashboard</h1>
          {selectedRestaurant && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {selectedRestaurant.name}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition-colors"
            onClick={() => setShowRestaurantSelector(true)}
          >
            <Building2 size={18} />
            <span>Change Restaurant</span>
          </button>
          <button className="flex items-center gap-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
            <QrCode size={18} />
            <span>View QR Code</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <button 
          className={`py-3 px-6 font-medium transition-colors ${
            activeTab === "overview" 
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
              : "text-gray-600 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={`py-3 px-6 font-medium transition-colors ${
            activeTab === "chat" 
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
              : "text-gray-600 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900">
        {activeTab === "overview" ? (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Active Visitors */}
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
                <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
                  Current visitors in your restaurant
                </div>
                <h2 className="text-3xl font-bold mb-2">4</h2>
                <div className="flex items-center text-sm text-green-500">
                  <span>+2 in the last hour</span>
                </div>
              </div>

              {/* Unread Messages */}
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
                <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
                  Messages requiring attention
                </div>
                <h2 className="text-3xl font-bold mb-2">1</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
                  <span>From 1 customers</span>
                </div>
              </div>

              {/* QR Scans */}
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
                <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
                  New sign-ups via QR code
                </div>
                <h2 className="text-3xl font-bold mb-2">24</h2>
                <div className="flex items-center text-sm text-green-500">
                  <span>+8 compared to yesterday</span>
                </div>
              </div>
            </div>

            {/* Current Visitors */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-bold">Current Visitors</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">People currently in your restaurant</p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {visitors.map(visitor => (
                  <div key={visitor.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {visitor.name.substring(0, 1)}
                      </div>
                      <div>
                        <h3 className="font-medium">{visitor.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{visitor.table}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                        <Clock size={14} />
                        {visitor.time}
                      </span>
                      <button className="p-2 text-gray-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-bold">Recent Messages</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Latest customer inquiries</p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {messages.map(message => (
                  <div key={message.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {message.name.substring(0, 1)}
                        </div>
                        {message.isNew && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{message.name}</h3>
                          {message.isNew && (
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{message.table}</p>
                        <p className="mt-1">{message.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-gray-500 dark:text-zinc-400">{message.time}</span>
                      <button className="p-2 text-gray-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="font-bold">Conversations</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Chat with your customers</p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 cursor-pointer ${
                      selectedChat === message.name 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : "hover:bg-gray-50 dark:hover:bg-zinc-700"
                    }`}
                    onClick={() => setSelectedChat(message.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {message.name.substring(0, 1)}
                        </div>
                        {message.isNew && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{message.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-zinc-400">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{message.table}</p>
                        <p className="text-sm truncate mt-1">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-900">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {selectedChat.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedChat}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      {messages.find(m => m.name === selectedChat)?.table}
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockChats[selectedChat]?.map((chat:ChatMessage, idx:number) => (
                    <div key={idx} className={`flex ${chat.isCustomer ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        chat.isCustomer 
                          ? "bg-gray-100 dark:bg-zinc-800" 
                          : "bg-blue-600 text-white"
                      }`}>
                        <p>{chat.text}</p>
                        <p className={`text-xs mt-1 ${
                          chat.isCustomer 
                            ? "text-gray-500 dark:text-zinc-400" 
                            : "text-blue-200"
                        }`}>{chat.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-zinc-700 border-none rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-r-md"
                      onClick={handleSendMessage}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
      {!selectedRestaurant || showRestaurantSelector ? renderRestaurantSelector() : renderDashboard()}
    </div>
  );
}