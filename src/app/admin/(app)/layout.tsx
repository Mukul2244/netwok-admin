"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import {
  Menu,
  Plus,
  Activity,
  CreditCard,
  Home,
  Store,
  Users,
  Settings,
  TicketPercent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSideBar, setOpenSideBar] = useState(false);
  const navigationItems = [
    { name: "Overview", href: "/admin", icon: Home, value: "overview" },
    { name: "Venues", href: "/admin/venues", icon: Store, value: "venues" },
    { name: "Users", href: "/admin/users", icon: Users, value: "users" },
    {
      name: "Coupons",
      href: "/admin/coupons",
      icon: TicketPercent,
      value: "coupons",
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
      value: "subscriptions",
    },
    {
      name: "Activity Log",
      href: "/admin/activity",
      icon: Activity,
      value: "activity",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      value: "settings",
    },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} navigationItems={navigationItems} />

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSideBar(true)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="hidden md:flex text-xl font-semibold">
              Super Admin Dashboard
            </h1>
            <h1 className="md:hidden text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="https://netwok.app" target="_blank">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              asChild
            >
              <Link href="/admin/venues/new">
                <Plus className="mr-2 h-4 w-4" />
                New Venue
              </Link>
            </Button>
          </div>
        </header>
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">{children}</main>
      </div>
    </div>
  );
}
