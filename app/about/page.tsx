import { Target, Users, Eye, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-blue-100">
            Building better communities through efficient complaint management
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To provide a seamless, transparent, and efficient platform that empowers
                  citizens to voice their concerns and enables government agencies to respond
                  quickly and effectively, ultimately creating better living conditions for
                  all community members.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Our Vision
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To revolutionize civic engagement by creating a world where every citizen
                  has a voice, every complaint is heard, and every issue is resolved promptly,
                  leading to more responsive governance and thriving communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About the System */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              About the System
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
              <p className="leading-relaxed">
                The Smart Complaint Management System is a comprehensive digital platform
                designed to bridge the gap between citizens and government departments. Our
                system streamlines the entire complaint lifecycle, from submission to
                resolution, ensuring transparency and accountability at every step.
              </p>
              <p className="leading-relaxed">
                Built with cutting-edge technology and user-centric design principles, our
                platform caters to four distinct user roles: Citizens who file complaints,
                Workers who execute resolutions, Office administrators who manage assignments,
                and System administrators who oversee the entire operation.
              </p>
              <p className="leading-relaxed">
                We believe in the power of technology to transform public services. By
                digitizing and automating the complaint management process, we reduce
                bureaucratic delays, eliminate paperwork, and provide real-time visibility
                into issue resolution progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardContent className="pt-6">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full inline-block mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Multi-Role Platform
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Separate portals for citizens, workers, offices, and admins with
                  role-specific features and dashboards.
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="pt-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full inline-block mb-4">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Real-Time Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor complaint status from submission to completion with live updates
                  and photo documentation at each stage.
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="pt-6">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full inline-block mb-4">
                  <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Smart Assignment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Intelligent complaint routing and worker assignment based on department,
                  location, and availability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Complaints Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
