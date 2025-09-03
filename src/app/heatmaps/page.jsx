// app/heatmaps/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaEye, FaClock } from 'react-icons/fa'

export default function HeatmapsPage() {
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

      if (error) throw error
      setAnalyses(data || [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Heatmap History</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Heatmap History</h1>
      
      {analyses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center py-12">
          <p className="text-gray-500 mb-4">No analyses yet.</p>
          <Link 
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload your first ultrasound
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysis.diagnosis === 'Benign' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {analysis.diagnosis}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">
                      Confidence: {analysis.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <FaClock className="mr-1" />
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Link 
                    href={`/heatmaps/${analysis.id}`}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                  >
                    <FaEye className="mr-1" />
                    View Heatmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}