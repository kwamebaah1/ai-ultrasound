import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Layout/Navigation'
import Header from '@/components/Layout/Header'
import MobileNavigation from '@/components/Layout/MobileNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ultrasound Analysis System',
  description: 'Advanced AI-powered breast ultrasound analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>
          
          {/* Mobile Navigation (will be shown at bottom on mobile) */}
          <MobileNavigation />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-4 sm:px-6 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}