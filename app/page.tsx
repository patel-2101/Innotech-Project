import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Complaint Management System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Efficient, Transparent, and Fast Resolution for All Your Civic Issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/citizen">
                <Button size="lg" variant="secondary" icon={ArrowRight}>
                  File a Complaint
                </Button>
              </Link>
              <Link href="/process">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                    <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fast Resolution
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your complaints in real-time and get updates at every step
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is protected with enterprise-level security measures
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  User Friendly
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simple interface designed for everyone, no technical knowledge required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your citizen account' },
              { step: '2', title: 'File Complaint', desc: 'Submit your issue with details' },
              { step: '3', title: 'Track Progress', desc: 'Monitor status in real-time' },
              { step: '4', title: 'Get Resolved', desc: 'Issue resolved by assigned worker' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Access Portal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/auth/citizen">
              <Card hover className="h-full cursor-pointer transition-transform hover:scale-105">
                <CardContent className="pt-6 text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full inline-block mb-4">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Citizen Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    File and track complaints
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/worker">
              <Card hover className="h-full cursor-pointer transition-transform hover:scale-105">
                <CardContent className="pt-6 text-center">
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full inline-block mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Worker Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Manage assigned tasks
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/office">
              <Card hover className="h-full cursor-pointer transition-transform hover:scale-105">
                <CardContent className="pt-6 text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full inline-block mb-4">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Office Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Assign and monitor work
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/admin">
              <Card hover className="h-full cursor-pointer transition-transform hover:scale-105">
                <CardContent className="pt-6 text-center">
                  <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full inline-block mb-4">
                    <Zap className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Admin Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    System administration
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens making their community better
          </p>
          <Link href="/auth/citizen/signup">
            <Button size="lg" variant="secondary" icon={ArrowRight}>
              Create Account Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
