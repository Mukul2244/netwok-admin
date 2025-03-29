import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from "@/context/AuthContext"
import { SocketProvider } from '@/context/SocketContext';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Netwok - Connect People in Your Venue",
  description:
    "Increase engagement, extend visit duration, and boost revenue by connecting visitors in your physical space.",
  icons: {
    icon: "/logo.svg"
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
