import { AuthProvider } from "@/context/AuthContext"

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}