'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Lock, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function OfficeLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/office/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Office Login</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage department complaints
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter User ID"
              icon={User}
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
            />
            
            <Input
              type="password"
              placeholder="Enter Password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="text-right">
              <Link
                href="/auth/office/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
