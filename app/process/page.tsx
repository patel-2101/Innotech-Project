import { FileText, UserCheck, Clock, CheckCircle, Star, Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-blue-100">
            A simple and transparent process to resolve your complaints
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Step 1 */}
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        File Your Complaint
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      Register as a citizen and log into your account. Click on &quot;Create
                      Complaint&quot; and fill out the form with details about your issue.
                      You can add photos, videos, and even use GPS to mark the exact location.
                      Voice input is also available for convenience.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Tip:</strong> Provide clear photos and detailed descriptions
                        for faster processing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Complaint Review & Assignment
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      Once submitted, your complaint is reviewed by the relevant department
                      office. The office administrator categorizes the complaint and assigns
                      it to an appropriate worker based on the type of issue, location, and
                      worker availability.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Timeline:</strong> Complaints are typically reviewed and
                        assigned within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Work In Progress
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      The assigned worker receives the complaint on their dashboard. They
                      visit the location and start working on the issue. Workers are required
                      to upload photos at different stages: Start, In Progress, and
                      Completion. You can track all updates in real-time.
                    </p>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        <strong>Transparency:</strong> Photo documentation ensures
                        accountability at every step.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Completion & Verification
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      Once the worker completes the task, they mark the complaint as
                      &quot;Completed&quot; and upload final photos. The office verifies the
                      work, and the complaint status is updated to &quot;Resolved.&quot; You
                      receive a notification about the completion.
                    </p>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Quality Check:</strong> Office administrators verify work
                        completion before closing tickets.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Rate & Review
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      After your complaint is resolved, you can rate the service and provide
                      feedback. Your ratings help us improve our services and recognize
                      excellent workers. Your voice matters in making the system better!
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Feedback Loop:</strong> Your ratings help improve service
                        quality and worker performance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notification System */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                    <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Stay Updated with Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Throughout the entire process, you&apos;ll receive notifications at key
                    stages:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>When your complaint is received and registered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>When a worker is assigned to your complaint</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>When work starts on your complaint</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>When progress updates are uploaded</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span>When your complaint is marked as resolved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
