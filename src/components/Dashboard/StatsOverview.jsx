import { FaCheckCircle, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'

export default function StatsOverview({ analyses }) {
  const totalAnalyses = analyses.length
  const benignCount = analyses.filter(a => a.diagnosis === 'Benign').length
  const malignantCount = analyses.filter(a => a.diagnosis === 'Malignant').length
  const benignPercentage = totalAnalyses > 0 ? (benignCount / totalAnalyses * 100).toFixed(1) : 0
  const malignantPercentage = totalAnalyses > 0 ? (malignantCount / totalAnalyses * 100).toFixed(1) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Analyses</p>
            <p className="text-2xl font-bold text-gray-800">{totalAnalyses}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FaChartLine className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Benign Results</p>
            <p className="text-2xl font-bold text-gray-800">
              {benignCount} <span className="text-sm text-gray-500">({benignPercentage}%)</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Malignant Results</p>
            <p className="text-2xl font-bold text-gray-800">
              {malignantCount} <span className="text-sm text-gray-500">({malignantPercentage}%)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}