"use client"
import { useRouter } from "next/navigation"  
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    } else {
      setIsChecking(false)
    }
  }, [router]) 

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Clean modern header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LearnHub
            </h1>
            {/* Optional: Add navigation links */}
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" onClick={() => router.push('/courses')}>
                Courses
              </Button>
              <Button variant="ghost" onClick={() => router.push('/profile')}>
                Profile
              </Button>
            </nav>
          </div>

          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Page content */}
      <main>
        {children}
      </main>
    </div>
  )
}