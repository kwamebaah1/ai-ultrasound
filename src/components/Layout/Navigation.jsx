'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  FaHome, 
  FaUpload, 
  FaChartArea, 
  FaComments,
  FaSignOutAlt,
  FaCog,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FaHome },
  { name: 'Upload & Analyze', href: '/upload', icon: FaUpload },
  { name: 'Heatmaps', href: '/heatmaps', icon: FaChartArea },
  { name: 'AI Assistant', href: '/chat', icon: FaComments },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-80 h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/20">
            <div className="animate-pulse flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
              <div className="ml-3 h-6 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-80 h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-all duration-300 ${isExpanded ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">US</span>
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ultrasound AI
            </h1>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-1 p-6">
          {/* Navigation Items - Only show if user is authenticated */}
          {user && (
            <nav className="flex-1 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:bg-white/50 hover:text-blue-600 hover:shadow-md'
                    }`}
                  >
                    <item.icon className="text-lg mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            {user ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{user.email}</p>
                    <p className="text-xs text-gray-500">Medical Professional</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-white/50 hover:text-blue-600 transition-all">
                    <FaCog className="mr-3" />
                    <span className="font-medium">Settings</span>
                  </button>
                  
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-white/50 hover:text-red-600 transition-all"
                  >
                    <FaSignOutAlt className="mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="flex items-center w-full px-4 py-3 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
                >
                  <FaSignInAlt className="mr-3" />
                  <span className="font-medium">Sign In</span>
                </Link>
                
                <Link
                  href="/signup"
                  className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <FaUserPlus className="mr-3" />
                  <span className="font-medium">Create Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}