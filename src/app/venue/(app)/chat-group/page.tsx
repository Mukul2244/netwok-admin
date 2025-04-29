

"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Users, Loader2 } from "lucide-react";
import { format, isToday, isYesterday } from 'date-fns';
import { useSocket } from "@/context/SocketContext";
import axiosInstance from "@/lib/axios";
import getCookie from "@/lib/getCookie";

// Interfaces
interface Message {
  sender_username: string;
  text: string;
  sender: number;
  timestamp: string;
}

interface ChatSectionProps {
  userId: number;
  restaurantId: string;
}

function ChatSection({ restaurantId, userId }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const { socket, setSocket } = useSocket();
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  
  // Fetch messages and establish WebSocket connection
  const handleConnection = useCallback(async () => {
    try {
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");

      if (!restaurantId || !qrCodeNumber) {
        console.error("Missing restaurantId or qrCodeNumber");
        return;
      }

      const response = await axiosInstance.get(
        `/group-chat/?restaurant=${restaurantId}&ordering=timestamp`
      );
      
      // Sort messages to show most recent first
      const sortedMessages = response.data.sort((a: Message, b: Message) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Reverse back to chronological order for proper display
      setMessages(sortedMessages.reverse());

      const token = await getCookie("accessToken");
      if (!token) {
        console.error("Missing access token");
        return;
      }

      const ws = new WebSocket(
        `wss://api.netwok.app/ws/group/${restaurantId}/${qrCodeNumber}/${token}/`
      );

      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setLoading(false);
        // Scroll to bottom once messages are loaded and websocket is connected
        setTimeout(scrollToBottom, 100);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket data:", data);
          
          // Check if typing event (either format might be used)
          if (data.type === "typing" || data.message_type === "typing") {
            // Get username from either property that exists
            const username = data.sender_username || data.username || "Someone";
            setTyping(username);
            
            // Clear previous timeout if exists
            if (typingTimeout) clearTimeout(typingTimeout);
            
            // Set new timeout to clear typing indicator after 3 seconds
            const timeout = setTimeout(() => setTyping(null), 3000);
            setTypingTimeoutRef(timeout);
          } else if (data.text || data.message) {
            // Handle new message (supporting both formats)
            setMessages((prevMessages) => [...prevMessages, data]);
            // Scroll to bottom when receiving a new message
            setTimeout(scrollToBottom, 100);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setLoading(false);
    }
  }, [restaurantId, setSocket, typingTimeout]);

  // Manage WebSocket lifecycle
  useEffect(() => {
    handleConnection();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
      }
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [handleConnection, setSocket, typingTimeout]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send typing indicator
  const handleTyping = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ 
        type: "typing",
        message_type: "typing" // Send both formats to be safe
      }));
    }
  };

  // Send a message
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: inputText }));
      setInputText("");
    }
  }, [inputText, socket]);

  // Get AI suggestions
  const handleAIAssist = () => {
    const suggestions = [
      "Anyone fancy trying that new IPA they just got in? 🍻",
      "How about we plan a pub crawl for next weekend? 🚶‍♂️🍺🚶‍♀️",
      "Did you hear about the new karaoke night starting next week? 🎤",
      "The food here is amazing! Has anyone tried today's special? 🍽️",
    ];
    setInputText(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  // Group messages by date
  const getMessagesByDate = () => {
    const groupedMessages: { [date: string]: Message[] } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });
    
    return groupedMessages;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true // This ensures AM/PM is displayed
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      // Try to handle different date formats
      let date;
      if (dateStr.includes('/')) {
        // Handle DD/MM/YYYY format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          date = new Date(dateStr);
        }
      } else {
        date = new Date(dateStr);
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateStr);
        return "Unknown Date";
      }
      
      if (isToday(date)) {
        return "Today";
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else {
        return format(date, "MMM dd, yyyy");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown Date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const groupedMessages = getMessagesByDate();
  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="flex flex-col flex-1 space-y-4 mb-4">
      <div 
        ref={scrollRef}
        className="flex-1 min-h-[350px] max-h-[450px] overflow-y-auto rounded-xl bg-white dark:bg-zinc-900 shadow-inner"
      >
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Users className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-medium text-zinc-600 dark:text-zinc-300">
              No messages yet
            </p>
          </div>
        ) : (
          <ScrollArea className="p-4">
            {sortedDates.map((date) => (
              <div key={date} className="mb-6">
                {/* Date divider */}
                <div className="relative flex items-center py-3">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                  <span className="flex-shrink mx-4 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {formatDate(date)}
                  </span>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>
                
                {/* Messages for this date */}
                {groupedMessages[date].map((msg, idx) => {
                  const isSentByMe = msg.sender === userId;
                  return (
                    <div
                      key={idx}
                      className={`mb-3 flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[80%]">
                        {!isSentByMe && (
                          <p className="text-xs font-medium text-zinc-500 ml-2 mb-1">
                            {msg.sender_username}
                          </p>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            isSentByMe
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <p className={`text-xs mt-1 ${isSentByMe ? "text-right mr-1" : "ml-2"} text-zinc-400`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {/* Typing indicator */}
            {typing && (
              <div className="flex items-center pl-2 my-2">
                <span className="text-xs text-zinc-500">{typing} is typing</span>
                <div className="ml-1 flex">
                  <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full mr-0.5 animate-pulse"></div>
                  <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full mr-0.5 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                  <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </div>
      
      <div className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyUp={handleTyping} // Fire on keyup to detect typing
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-1 border-zinc-300 focus:border-purple-500 rounded-full"
          />
          <Button
            onClick={handleAIAssist}
            variant="outline"
            size="icon"
            className="text-zinc-500 hover:bg-zinc-100 rounded-full"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full"
            disabled={!inputText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatGroupTab() {
  const [userId, setUserId] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    const storedUser = localStorage.getItem("user");

    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser?.id ?? null);
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }

    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!restaurantId || !userId) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground">Missing Info</h1>
        <p className="text-muted-foreground">
          Please make sure you&apos;re logged in and have selected a restaurant.
        </p>
      </div>
    );
  }

  return (
    <Card className="col-span-4 bg-white dark:bg-zinc-900 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardTitle>Restaurant Chat Group</CardTitle>
        <CardDescription className="text-purple-100">
          Connect with others at your restaurant
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChatSection userId={userId} restaurantId={restaurantId} />
      </CardContent>
    </Card>
  );
}