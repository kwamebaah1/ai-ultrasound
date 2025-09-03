'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaBell, FaSearch, FaBars } from 'react-icons/fa'

export default function Header() {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side - Menu button for mobile */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaBars className="text-gray-600" />
        </button>

        {/* Center - Search bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              className="w-full pl-10 pr-4 py-2 bg-white/50 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right side - User info and notifications */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors relative">
            <FaBell className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {user && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block ml-3">
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">Medical Professional</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}