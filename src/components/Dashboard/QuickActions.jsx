import Link from 'next/link'
import { FaUpload, FaRobot, FaChartLine, FaPlus } from 'react-icons/fa'

export default function QuickActions() {
  const actions = [
    {
      title: 'New Analysis',
      description: 'Upload ultrasound image',
      icon: FaUpload,
      href: '/upload',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get medical insights',
      icon: FaRobot,
      href: '/chat',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'View Heatmaps',
      description: 'Visual analysis',
      icon: FaChartLine,
      href: '/heatmaps',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 min-w-[140px]"
        >
          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
            <action.icon />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{action.description}</p>
        </Link>
      ))}
      
      <button className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 min-w-[140px] flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
          <FaPlus />
        </div>
        <span className="text-xs text-gray-500">More</span>
      </button>
    </div>
  )
}