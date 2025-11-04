'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Star, Calendar, MapPin, Image as ImageIcon, User, Home } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Input, Textarea, Select } from '@/components/ui/input'

interface Complaint {
  id: string
  title: string
  category: string
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected'
  date: string
  location: string
  image?: string
}

export default function CitizenDashboard() {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/auth/citizen/login')
      return
    }

    // Get user data
    const name = localStorage.getItem('userName') || 'Citizen'
    const phone = localStorage.getItem('userPhone') || ''
    setUserName(name)
    setUserPhone(phone)
  }, [router])

  const [complaints] = useState<Complaint[]>([
    {
      id: 'C001',
      title: 'Road pothole near Main Street',
      category: 'Road',
      status: 'in-progress',
      date: '2025-11-01',
      location: 'Main Street, Block A',
      image: '/placeholder-road.jpg'
    },
    {
      id: 'C002',
      title: 'Water leakage in pipeline',
      category: 'Water',
      status: 'assigned',
      date: '2025-10-28',
      location: 'Park Avenue',
    },
    {
      id: 'C003',
      title: 'Sewage overflow',
      category: 'Sewage',
      status: 'completed',
      date: '2025-10-25',
      location: '5th Avenue',
    },
  ])

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader
        title="Citizen Dashboard"
        subtitle={`Welcome back, ${userName}!${userPhone ? ` (${userPhone})` : ''}`}
      />

      {/* Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 overflow-x-auto">
            <Link
              href="/citizen/dashboard"
              className="flex items-center gap-2 py-4 px-2 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 py-4 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Complaint
            </button>
            <Link
              href="/citizen/dashboard"
              className="flex items-center gap-2 py-4 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              My Complaints
            </Link>
            <Link
              href="/citizen/profile"
              className="flex items-center gap-2 py-4 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium whitespace-nowrap"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            icon={Plus}
            className="w-full"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Complaint
          </Button>
          <Button icon={FileText} variant="outline" className="w-full">
            View All Complaints
          </Button>
          <Button icon={Star} variant="outline" className="w-full">
            Rate Services
          </Button>
        </div>

        {/* Complaints Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Complaints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <Card key={complaint.id} hover>
                {complaint.image && (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{complaint.title}</CardTitle>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statusColors[complaint.status]
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4 mr-2" />
                    {complaint.category}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {complaint.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {complaint.location}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Complaint Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Complaint"
        size="lg"
      >
        <form className="space-y-4">
          <Input
            label="Complaint Title"
            type="text"
            placeholder="Brief description of the issue"
            required
          />

          <Select
            label="Category"
            options={[
              { value: '', label: 'Select Category' },
              { value: 'road', label: 'Road' },
              { value: 'water', label: 'Water' },
              { value: 'sewage', label: 'Sewage' },
              { value: 'electricity', label: 'Electricity' },
              { value: 'garbage', label: 'Garbage' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <Textarea
            label="Description"
            placeholder="Provide detailed information about the complaint"
            rows={4}
            required
          />

          <Input
            label="Location"
            type="text"
            placeholder="Enter location or use GPS"
            icon={MapPin}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GPS Location
            </label>
            <Button type="button" variant="outline" className="w-full">
              <MapPin className="w-4 h-4 mr-2" />
              Get Current Location
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click to auto-fill location from GPS
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Image/Video
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional: Add photos or videos of the issue
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Voice Input (Optional)
            </label>
            <Button type="button" variant="outline" className="w-full">
              🎤 Record Voice Description
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Submit Complaint
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
