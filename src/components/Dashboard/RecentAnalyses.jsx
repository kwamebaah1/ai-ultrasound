import Link from 'next/link'
import { FaEye, FaClock } from 'react-icons/fa'

export default function RecentAnalyses({ analyses, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Analyses</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Analyses</h2>
        <p className="text-gray-500">No analyses yet. Upload your first ultrasound to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Analyses</h2>
      <div className="space-y-4">
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
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}