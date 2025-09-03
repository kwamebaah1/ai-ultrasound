'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import HeatmapVisualization from '@/components/HeatmapVisualization/HeatmapVisualization'

export default function HeatmapViewer() {
  const params = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalysis()
  }, [params.id])

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!analysis) return <div>Analysis not found</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Heatmap Visualization</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Analysis Details</h2>
          <p>Diagnosis: {analysis.diagnosis}</p>
          <p>Confidence: {analysis.confidence}%</p>
          <p>Date: {new Date(analysis.created_at).toLocaleDateString()}</p>
        </div>
        
        {analysis.heatmap_url && (
          <HeatmapVisualization 
            heatmapUrl={analysis.heatmap_url} 
            diagnosis={analysis.diagnosis} 
          />
        )}
      </div>
    </div>
  )
}