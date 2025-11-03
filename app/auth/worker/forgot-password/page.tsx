'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function WorkerForgotPassword() {
  const [userId, setUserId] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your User ID to reset password
          </p>
        </CardHeader>
        
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your User ID"
                icon={User}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg">
                <p className="text-sm">
                  Password reset instructions have been sent to your registered contact.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/worker"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
