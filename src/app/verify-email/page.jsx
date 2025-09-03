'use client'
import Link from 'next/link'
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We've sent a verification link to your email address
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <FaEnvelope className="text-blue-500 text-2xl mr-2" />
            <span className="text-sm font-medium text-gray-700">Verify your email</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Please click the verification link in the email we sent to complete your registration. 
            The link will expire in 24 hours.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Return to Sign In
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the email?{' '}
            <button className="text-blue-600 hover:text-blue-500 font-medium">
              Resend verification
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}