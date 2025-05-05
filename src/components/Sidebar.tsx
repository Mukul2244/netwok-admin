"use client";

import Link from "next/link";
import {
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logout } from "@/lib/logout";

export default function Sidebar({
  openSideBar,
  setOpenSideBar,
  navigationItems,
}: {
  openSideBar: boolean;
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  navigationItems: {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    value: string;
  }[];
}) {
  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("qrCodeNumber");
    await logout();
  };
  return (
    <>
      {openSideBar && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpenSideBar(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card  border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          openSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center justify-center p-2 ml-6">
            <Link href="/">
              <Image src="/logo.svg" alt="logo" width={128} height={16} />
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSideBar(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4">
          <nav className="space-y-1 px-2 divide-dashed divide-y-2 divide-muted">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border-transparent hover:border-accent"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center absolute bottom-0 w-full border-t-2 p-4">
          <AlertDialog>
            <AlertDialogTrigger className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Clicking &quot;Continue&quot; will log you out and redirect you to the
                  login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
