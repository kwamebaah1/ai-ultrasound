import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Layout/Navigation'
import Header from '@/components/Layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ultrasound Analysis System',
  description: 'Advanced AI-powered breast ultrasound analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Navigation />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}