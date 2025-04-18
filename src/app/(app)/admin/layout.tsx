"use client";

import type React from "react";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/user-context";
import { Sidebar } from "@/components/sidebar";
import {Home, Users, Store, DollarSign, Activity, PlusCircle } from "lucide-react"


const navigationItems = [
    { name: "Overview", href: "/", icon: Home, value: "overview" },
    { name: "Pubs", href: "/admin/pubs", icon: Store, value: "pubs" },
    { name: "Users", href: "/admin/users", icon: Users, value: "users" },
    { name: "Revenue", href: "/admin/revenue", icon: DollarSign, value: "revenue" },
    { name: "Activity", href: "/admin/activity", icon: Activity, value: "activity" },
    { name: "Register Pub", href: "/admin/register-pub", icon: PlusCircle, value: "register-pub" },
  ];

export default function AdminLayout({
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
            <TopNav title = "Admin Dashboard" />
            <div className="container mx-auto py-6 ">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </UserProvider>
  );
}