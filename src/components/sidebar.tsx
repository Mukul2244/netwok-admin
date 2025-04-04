"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  MessageSquare,
  QrCode,
  Settings,
  Users,
  Home,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const navigation = [
  { name: "Restaurants", href: "/restaurant", icon: Home, value: "restaurants" },
  { name: "Dashboard", href: "/restaurant/dashboard", icon: BarChart2, value: "dashboard" },
  { name: "Analytics", href: "/restaurant/analytics", icon: BarChart2, value: "analytics" },
  { name: "Chat Group", href: "/restaurant/chat-group", icon: MessageSquare, value: "chat-group" },
  { name: "Users", href: "/restaurant/users", icon: Users, value: "users" },
  { name: "QR Code", href: "/restaurant/qr-code", icon: QrCode, value: "qr-code" },
  { name: "Settings", href: "/restaurant/settings", icon: Settings, value: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const NavItem = ({ item }: { item: typeof navigation[number] }) => (
    <TooltipProvider >
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <TooltipProvider>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:static",
          `${isCollapsed ? "w-[72px]" : "w-64"}`,
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Collapse/Expand Button */}
        <div className="border-b border-border">
          <div className={cn("flex h-16 items-center gap-2 px-4", isCollapsed && "justify-center px-2")}>
            <Button
              variant="ghost"
              size="sm"
              className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
              <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div
          className="flex-1 overflow-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}