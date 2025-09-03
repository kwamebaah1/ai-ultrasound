'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RecentAnalyses from '@/components/Dashboard/RecentAnalyses'
import StatsOverview from '@/components/Dashboard/StatsOverview'

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <StatsOverview analyses={analyses} />
      
      <div className="mt-8">
        <RecentAnalyses analyses={analyses} loading={loading} />
      </div>
    </div>
  )
}