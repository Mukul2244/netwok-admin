import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from "@/context/UserAuthContext"
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
