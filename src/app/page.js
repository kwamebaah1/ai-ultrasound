'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RecentAnalyses from '@/components/Dashboard/RecentAnalyses'
import StatsOverview from '@/components/Dashboard/StatsOverview'
import QuickActions from '@/components/Dashboard/QuickActions'

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setAnalyses(data || [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your analysis overview.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <QuickActions />
        </div>
      </div>
      
      {/* Stats Overview */}
      <StatsOverview analyses={analyses} />
      
      {/* Recent Analyses */}
      <RecentAnalyses analyses={analyses} loading={loading} />
    </div>
  )
}
