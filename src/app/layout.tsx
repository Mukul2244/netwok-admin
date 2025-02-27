import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { AuthProvider } from "@/context/AuthContext"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
