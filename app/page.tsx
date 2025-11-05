import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-semibold">🚀 Modern Complaint Management System</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Smart Complaint
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Efficient, Transparent, and Lightning-Fast Resolution for All Your Civic Issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/citizen">
                <Button size="lg" variant="secondary" icon={ArrowRight} className="shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
                  File a Complaint
                </Button>
              </Link>
              <Link href="/process">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-white/50 transition-all transform hover:scale-105">
                  How It Works
                </Button>
              </Link>
            </div>
            
            {/* Statistics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-3xl md:text-4xl font-bold text-white">10K+</p>
                <p className="text-sm text-blue-100 mt-1">Citizens Registered</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
                <p className="text-sm text-blue-100 mt-1">Active Workers</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-3xl md:text-4xl font-bold text-white">95%</p>
                <p className="text-sm text-blue-100 mt-1">Resolution Rate</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-3xl md:text-4xl font-bold text-white">24/7</p>
                <p className="text-sm text-blue-100 mt-1">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of complaint management with cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-500">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Fast Resolution
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Track your complaints in real-time and get instant updates at every step of the process
                </p>
              </CardContent>
            </Card>

            <Card hover className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-green-500">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-2xl shadow-lg group-hover:shadow-green-500/50 transition-all">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your data is protected with military-grade encryption and enterprise-level security
                </p>
              </CardContent>
            </Card>

            <Card hover className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-purple-500">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-5 rounded-2xl shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  User Friendly
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Intuitive interface designed for everyone, no technical expertise required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your issues resolved in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 dark:from-blue-800 dark:via-blue-600 dark:to-blue-400"></div>
            
            {[
              { step: '1', title: 'Register', desc: 'Create your citizen account in seconds', color: 'from-blue-500 to-blue-600' },
              { step: '2', title: 'File Complaint', desc: 'Submit your issue with photos & location', color: 'from-green-500 to-green-600' },
              { step: '3', title: 'Track Progress', desc: 'Monitor status updates in real-time', color: 'from-purple-500 to-purple-600' },
              { step: '4', title: 'Get Resolved', desc: 'Issue resolved by our expert team', color: 'from-orange-500 to-orange-600' },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-xl hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Get Started</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Access Your Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your role and login to access the dashboard
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/auth/citizen">
              <Card hover className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group border-2 border-transparent hover:border-blue-500">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl inline-block mb-4 group-hover:shadow-blue-500/50 shadow-lg transition-all group-hover:scale-110">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Citizen Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    File and track your complaints
                  </p>
                  <div className="mt-4 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Access Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/worker">
              <Card hover className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group border-2 border-transparent hover:border-green-500">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-2xl inline-block mb-4 group-hover:shadow-green-500/50 shadow-lg transition-all group-hover:scale-110">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Worker Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Manage your assigned tasks
                  </p>
                  <div className="mt-4 text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Access Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/office">
              <Card hover className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group border-2 border-transparent hover:border-purple-500">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-5 rounded-2xl inline-block mb-4 group-hover:shadow-purple-500/50 shadow-lg transition-all group-hover:scale-110">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Office Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Assign and monitor work
                  </p>
                  <div className="mt-4 text-purple-600 dark:text-purple-400 font-semibold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Access Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/admin">
              <Card hover className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 group border-2 border-transparent hover:border-red-500">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="bg-gradient-to-br from-red-400 to-red-600 p-5 rounded-2xl inline-block mb-4 group-hover:shadow-red-500/50 shadow-lg transition-all group-hover:scale-110">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Admin Login
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    System administration
                  </p>
                  <div className="mt-4 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Access Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:30px_30px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-3xl mx-auto">
            Join thousands of citizens making their community better every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/citizen/signup">
              <Button size="lg" variant="secondary" icon={ArrowRight} className="shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-105">
                Create Account Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 shadow-xl transition-all transform hover:scale-105">
                Contact Support
              </Button>
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Verified System</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
