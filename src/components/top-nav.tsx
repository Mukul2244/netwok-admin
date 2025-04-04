"use client";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useUser } from "@/contexts/user-context";

export function TopNav() {
  const { userDetails } = useUser();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("qrCodeNumber");
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background  ">
      <div className="mx-auto container flex h-16 items-center justify-end md:justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <div className="flex items-center space-x-2 gap-4">
            <Image
              width={32}
              height={32}
              src="/logo.svg"
              alt="Logo"
              className="h-16 w-16 rounded-full"
            />
            <span className="text-2xl font-semibold text-foreground">
              Restaurant Owner Dashboard
            </span>
          </div>
        </div>

        {/* Right Section: Theme Toggle and User Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>
                    {userDetails?.username?.charAt(0).toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {/* User Info */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userDetails?.username || "your username"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userDetails?.email || "your email"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Logout Button */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}