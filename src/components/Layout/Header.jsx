'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Ultrasound Analysis Dashboard</h1>
        </div>
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <span className="ml-2 text-sm text-gray-700">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}