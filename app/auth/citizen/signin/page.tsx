'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Phone, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CitizenSignIn() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prepare request body based on login method
      const requestBody = loginMethod === 'email' 
        ? { email: formData.email, password: formData.password }
        : { phone: formData.phone, otp: formData.otp }

      const response = await fetch('/api/auth/citizen/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.citizen))
        localStorage.setItem('role', 'citizen')
        
        // Redirect to dashboard
        router.push('/citizen/dashboard')
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Citizen Sign In</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your complaints
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Toggle Login Method */}
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={loginMethod === 'email' ? 'primary' : 'outline'}
              className="flex-1"
              onClick={() => setLoginMethod('email')}
            >
              Email
            </Button>
            <Button
              type="button"
              variant={loginMethod === 'phone' ? 'primary' : 'outline'}
              className="flex-1"
              onClick={() => setLoginMethod('phone')}
            >
              Phone
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loginMethod === 'email' ? (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={loading}
                />
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  icon={Lock}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  required
                  disabled={loading}
                />
                <Button type="button" variant="outline" className="w-full" disabled={loading}>
                  Send OTP
                </Button>
              </>
            )}

            <div className="text-right">
              <Link
                href="/auth/citizen/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/citizen/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
