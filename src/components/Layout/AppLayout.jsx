'use client'

import Navigation from '@/components/Layout/Navigation'
import Header from '@/components/Layout/Header'
import MobileNavigation from '@/components/Layout/MobileNavigation'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const authFreeRoutes = ['/login', '/signup']

export default function AppLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)

      // Redirect unauthenticated users
      if (!user && !authFreeRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
    getUser()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const hideLayout = authFreeRoutes.includes(pathname)

  if (hideLayout) {
    return <div className="min-h-screen bg-gray-100">{children}</div>
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}