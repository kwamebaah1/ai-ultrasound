'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaHome, 
  FaUpload, 
  FaChartArea, 
  FaComments,
  FaSignOutAlt 
} from 'react-icons/fa'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FaHome },
  { name: 'Upload & Analyze', href: '/upload', icon: FaUpload },
  { name: 'Heatmaps', href: '/heatmaps', icon: FaChartArea },
  { name: 'AI Assistant', href: '/chat', icon: FaComments },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 shadow-md">
          <h1 className="text-xl font-bold text-blue-700">Ultrasound AI</h1>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto">
            <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100">
              <FaSignOutAlt className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}