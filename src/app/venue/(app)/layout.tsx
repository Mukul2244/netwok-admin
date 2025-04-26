"use client";
import type React from "react";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/user-context";
import { Sidebar } from "@/components/sidebar";
import {BarChart2,MessageSquare,QrCode,Settings,Users,Home, } from "lucide-react";

const navigationItems = [
  { name: "Restaurants", href: "/venue", icon: Home, value: "restaurants" },
  { name: "Dashboard", href: "/venue/dashboard", icon: BarChart2, value: "dashboard" },
  { name: "Analytics", href: "/venue/analytics", icon: BarChart2, value: "analytics" },
  { name: "Chat Group", href: "/venue/chat-group", icon: MessageSquare, value: "chat-group" },
  { name: "Users", href: "/venue/users", icon: Users, value: "users" },
  { name: "QR Code", href: "/venue/qr-code", icon: QrCode, value: "qr-code" },
  { name: "Settings", href: "/venue/settings", icon: Settings, value: "settings" },
];

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <TooltipProvider delayDuration={0}>
        <div className="min-h-screen flex">
          <Sidebar navigation={navigationItems} />
          <div className="flex-1">
            <TopNav title = "Restaurant owner Dashboard" />
            <div className="container mx-auto py-6 ">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </UserProvider>
  );
}