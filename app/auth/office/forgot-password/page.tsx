'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, AlertCircle, ArrowLeft, Mail, Phone, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function OfficeForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState<'userId' | 'method' | 'otp' | 'success'>('userId')
  const [userId, setUserId] = useState('')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [maskedContact, setMaskedContact] = useState('')

  const handleUserIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStep('method')
  }

  const handleMethodSubmit = async (selectedMethod: 'email' | 'phone') => {
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch('/api/offices/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, method: selectedMethod })
      })

      const data = await response.json()

      if (data.success) {
        setMaskedContact(data.data.contact)
        setMethod(selectedMethod)
        setStep('otp')
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/offices/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp, newPassword })
      })

      const data = await response.json()

      if (data.success) {
        setStep('success')
        setTimeout(() => {
          router.push('/auth/office')
        }, 3000)
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your User ID to reset password
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Step 1: Enter User ID */}
          {step === 'userId' && (
            <form onSubmit={handleUserIdSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your User ID"
                icon={User}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Select Method */}
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                How would you like to receive the OTP?
              </p>
              <Button
                type="button"
                onClick={() => handleMethodSubmit('email')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Mail className="w-5 h-5" />
                Send OTP via Email
              </Button>
              <Button
                type="button"
                onClick={() => handleMethodSubmit('phone')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Phone className="w-5 h-5" />
                Send OTP via SMS
              </Button>
              <Button
                type="button"
                onClick={() => setStep('userId')}
                variant="ghost"
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}

          {/* Step 3: Enter OTP and New Password */}
          {step === 'otp' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200 text-center">
                OTP sent to {maskedContact}
              </div>

              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                icon={Lock}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />

              <Input
                type="password"
                placeholder="Enter new password"
                icon={Lock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Confirm new password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Button
                type="button"
                onClick={() => handleMethodSubmit(method)}
                variant="ghost"
                className="w-full"
                disabled={loading}
              >
                Resend OTP
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Password Reset Successful!</p>
                <p className="text-sm">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link
                href="/auth/office"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
