import { Inter } from 'next/font/google'
import './globals.css'
import AppLayout from '@/components/Layout/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ultrasound Analysis System',
  description: 'Advanced AI-powered breast ultrasound analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}