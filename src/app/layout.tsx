import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { SocketProvider } from '@/context/SocketContext';
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <SocketProvider>
              {children}
            </SocketProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
