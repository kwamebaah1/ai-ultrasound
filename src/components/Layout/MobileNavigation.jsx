'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaHome, 
  FaUpload, 
  FaChartArea, 
  FaComments
} from 'react-icons/fa'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FaHome },
  { name: 'Upload', href: '/upload', icon: FaUpload },
  { name: 'Heatmaps', href: '/heatmaps', icon: FaChartArea },
  { name: 'Chat', href: '/chat', icon: FaComments },
]

export default function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
      <div className="flex justify-around items-center p-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <item.icon className="text-xl mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}