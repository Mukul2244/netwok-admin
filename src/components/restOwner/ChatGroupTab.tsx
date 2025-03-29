"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import axiosInstance from "@/lib/axios";
import getCookie from "@/lib/getCookie";

interface Message {
  sender_username: string;
  text: string;
  timestamp: string;
}

function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const { username } = useAuth();
  const { socket, setSocket } = useSocket();
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null); // Ref for the scrollable container
  const restaurantId = localStorage.getItem("restaurantId");

  const handleConnection = useCallback(async () => {
    try {
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");

      if (!restaurantId || !qrCodeNumber) {
        console.error("Missing restaurantId or qrCodeNumber");
        return;
      }

      const response = await axiosInstance.get(`/group-chat/?restaurant=${restaurantId}&orderBy = desc`);
      setMessages(response.data);

      const token = await getCookie("accessToken");
      if (!token) {
        console.error("Missing access token");
        return;
      }

      const ws = new WebSocket(`wss://api.netwok.app/ws/group/${restaurantId}/${qrCodeNumber}/${token}/`);

      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setLoading(false);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]); // Append new messages
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

  useEffect(() => {
    handleConnection();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
        console.log("WebSocket connection closed");
      }
    };
  }, [handleConnection, setSocket]);

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (inputText.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: inputText }));
      setInputText("");
    }
  }, [inputText, socket]);

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
    return date.toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS"
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading chat...</p>;
  }

  return (
    <div className="flex-col flex-1 shadow-md transition-all duration-300 space-y-4 flex mb-4 p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg">
      <div
        ref={scrollRef} // Attach the scrollable container to the ref
        className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto"
      >
        {messages.length === 0 ? (
          <p className="text-center text-blue-500">No messages yet</p>
        ) : (
          <ScrollArea className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.sender_username === username ? "justify-end" : "justify-start"} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                    msg.sender_username === username
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-white text-blue-800"
                  } hover:shadow-xl`}
                >
                  <p className="font-semibold">{msg.sender_username === username ? "You" : msg.sender_username}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimestamp(msg.timestamp)}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-blue-200 rounded-b-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-full transition-all duration-300"
          />
          <Button
            onClick={handleAIAssist}
            variant="outline"
            size="icon"
            className="text-blue-500 border-blue-300 hover:bg-blue-100 rounded-full transition-all duration-300"
          >
            <Sparkles className="h-5 w-5" />
            <span className="sr-only">AI assist</span>
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 rounded-full"
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
  const restaurantId = localStorage.getItem("restaurantId");
  if (!restaurantId) return <p className="text-center text-gray-500">No restaurant selected</p>;

  return (
    <Card className="col-span-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <CardTitle>Restaurant Chat Group</CardTitle>
        <CardDescription className="text-cyan-100">Monitor ongoing conversations in your restaurant</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChatSection />
      </CardContent>
    </Card>
  );
}

