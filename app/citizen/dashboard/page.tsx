'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Star, Calendar, MapPin, Image as ImageIcon, User, Home, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Office {
  userId: string
  name: string
  department: string
  phone?: string
  email?: string
}

interface Worker {
  userId: string
  name: string
  department: string
  phone?: string
  email?: string
}

interface ProgressPhoto {
  stage: 'start' | 'in-progress' | 'completed'
  url: string
  publicId: string
  uploadedAt: string
}

interface Complaint {
  _id: string
  title: string
  description: string
  category: string
  department: string
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected'
  createdAt: string
  updatedAt: string
  completedAt?: string
  location: {
    address?: string
    coordinates: [number, number]
  }
  media: {
    type: 'image' | 'video'
    url: string
    publicId: string
  }[]
  progressPhotos: ProgressPhoto[]
  assignedTo?: Worker
  officeId?: Office
  priority?: 'low' | 'medium' | 'high'
  rating?: number
  feedback?: string
  rejectionReason?: string
}

export default function CitizenDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch complaints from database
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        router.push('/auth/citizen/login')
        return
      }

      const response = await fetch('/api/complaints/my-complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setComplaints(data.data)
      } else {
        console.error('Failed to fetch complaints:', data.message)
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      router.push('/auth/citizen/login')
      return
    }

    // Get user data
    const name = localStorage.getItem('userName') || 'Citizen'
    const phone = localStorage.getItem('userPhone') || ''
    setUserName(name)
    setUserPhone(phone)

    // Initial fetch
    fetchComplaints()

    // Setup auto-refresh
    const interval = setInterval(() => {
      fetchComplaints()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [router])

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchComplaints()
  }

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
            <Link
              href="/citizen/complaint/create"
              className="flex items-center gap-2 py-4 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Complaint
            </Link>
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
          <Link href="/citizen/complaint/create" className="w-full">
            <Button icon={Plus} className="w-full">
              Create Complaint
            </Button>
          </Link>
          <Button icon={FileText} variant="outline" className="w-full">
            View All Complaints
          </Button>
          <Button icon={Star} variant="outline" className="w-full">
            Rate Services
          </Button>
        </div>

        {/* Complaints Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Complaints ({complaints.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Loading complaints...</div>
            </div>
          ) : complaints.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No complaints yet</p>
                <Link href="/citizen/complaint/create">
                  <Button icon={Plus}>Create Your First Complaint</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <Card key={complaint._id} hover>
                  {/* Complaint Image */}
                  {complaint.media && complaint.media.length > 0 ? (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      {complaint.media[0].type === 'image' ? (
                        <img
                          src={complaint.media[0].url}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-base line-clamp-2">{complaint.title}</CardTitle>
                      <span
                        className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          statusColors[complaint.status]
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {complaint._id.slice(-8)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4 mr-2 shrink-0" />
                      <span className="capitalize">{complaint.category}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 shrink-0" />
                      {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>

                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {complaint.location.address || 'Location not provided'}
                      </span>
                    </div>

                    {/* Office Assignment */}
                    {complaint.officeId && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned Office:</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {complaint.officeId.name}
                        </p>
                      </div>
                    )}

                    {/* Worker Assignment */}
                    {complaint.assignedTo && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned Worker:</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {complaint.assignedTo.name}
                        </p>
                      </div>
                    )}

                    {/* Progress Photos Count */}
                    {complaint.progressPhotos && complaint.progressPhotos.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {complaint.progressPhotos.length} progress update(s)
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {complaint.status === 'rejected' && complaint.rejectionReason && (
                      <div className="pt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected: {complaint.rejectionReason}
                        </p>
                      </div>
                    )}

                    <Link href={`/citizen/complaint/${complaint._id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
