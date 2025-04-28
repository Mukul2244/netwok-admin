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
import { Send, Sparkles } from "lucide-react";
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


function ChatSection({  restaurantId, userId}: ChatSectionProps) {
  // Load before render

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  const { socket, setSocket } = useSocket();
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      setMessages(response.data);

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
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("New message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
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
  }, [restaurantId, setSocket]);

  // Manage WebSocket lifecycle
  useEffect(() => {
    handleConnection();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
      }
    };
  }, [handleConnection, setSocket]);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a message
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: inputText }));
      setInputText("");
    }
  }, [inputText, socket]);

  // AI-generated message suggestions
  const handleAIAssist = () => {
    const aiSuggestions = [
      "Anyone fancy trying that new IPA they just got in? 🍻",
      "How about we plan a pub crawl for next weekend? 🚶‍♂️🍺🚶‍♀️",
      "Did you hear about the new karaoke night starting next week? 🎤🎶",
    ];
    setInputText(aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return <p className="text-center text-zinc-500">Loading chat...</p>;
  }

  return (
    <div className="flex flex-col flex-1 shadow-md transition-all duration-300 space-y-4 mb-4 p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 rounded-lg">
      <div
        ref={scrollRef}
        className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto"
      >
        {messages.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            No messages yet
          </p>
        ) : (
          <ScrollArea className="space-y-4">
            {messages.map((msg, index) => {
               const isSentByMe = msg.sender === userId;
               return(
              <div
                key={index}
                className={`mb-4 flex ${
                  isSentByMe
                    ? "justify-end"
                    : "justify-start"
                } animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                    isSentByMe
                      ? "bg-gradient-to-r from-zinc-500 to-zinc-600 text-white"
                      : "bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                  } hover:shadow-xl`}
                >
                  <p className="font-semibold">
                    { isSentByMe
                      ? "You"
                      : msg.sender_username}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            )})}
          </ScrollArea>
        )}
      </div>
      <div className="p-4 bg-background backdrop-blur-md border-t border-zinc-200 dark:border-zinc-700 rounded-b-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-full transition-all duration-300"
          />
          <Button
            onClick={handleAIAssist}
            variant="outline"
            size="icon"
            className="text-zinc-500 border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-300"
          >
            <Sparkles className="h-5 w-5" />
            <span className="sr-only">AI assist</span>
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-zinc-500 to-zinc-600 text-white hover:from-zinc-600 hover:to-zinc-700 dark:from-zinc-700 dark:to-zinc-800 dark:hover:from-zinc-800 dark:hover:to-zinc-900 rounded-full"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatGroupTab() {
  const [userId, setUserId] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false); // Prevent hydration mismatch

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

  if (!loaded) return null; // Avoid hydration issues

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
    <Card className="col-span-4 bg-background shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-zinc-500 to-zinc-600 text-white dark:from-zinc-700 dark:to-zinc-800">
        <CardTitle>Restaurant Chat Group</CardTitle>
        <CardDescription className="text-zinc-100 dark:text-zinc-200">
          Monitor ongoing conversations in your restaurant
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChatSection userId={userId} restaurantId={restaurantId} />
      </CardContent>
    </Card>
  );
}























