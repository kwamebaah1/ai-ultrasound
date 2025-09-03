'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import HeatmapVisualization from '@/components/Heatmap/HeatmapVisualization'
import ProbabilityBar from '@/components/ProbabilityBar'
import DiagnosisResult from '@/components/DiagnosisResult'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center py-12">
        <p className="text-gray-500">Analysis not found.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Heatmap Visualization</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Analysis Details</h2>
            
            <DiagnosisResult diagnosis={analysis.diagnosis} confidence={analysis.confidence} />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Probability Distribution</h3>
              <div className="space-y-4">
                <ProbabilityBar label="Benign" value={analysis.benign_prob} color="green" />
                <ProbabilityBar label="Malignant" value={analysis.malignant_prob} color="red" />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Explanation</h3>
              <div className="bg-blue-50/70 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                {analysis.advice}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Analysis performed on: {new Date(analysis.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Heatmap Visualization</h2>
            
            {analysis.heatmap_url ? (
              <HeatmapVisualization 
                heatmapUrl={analysis.heatmap_url} 
                diagnosis={analysis.diagnosis} 
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No heatmap available for this analysis.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Heatmaps are only generated for malignant diagnoses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}