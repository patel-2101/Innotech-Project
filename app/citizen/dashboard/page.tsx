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

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')
    const storedName = localStorage.getItem('userName')
    const storedPhone = localStorage.getItem('userPhone')
    
    if (!token || role !== 'citizen') {
      router.push('/auth/citizen/login')
      return
    }
    
    if (storedName) setUserName(storedName)
    if (storedPhone) setUserPhone(storedPhone)
  }, [router])

  // Fetch complaints from database
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found')
        router.push('/auth/citizen/login')
        return
      }

      console.log('Fetching complaints with token:', token.substring(0, 20) + '...')
      
      const response = await fetch('/api/complaints/my-complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        console.log('Complaints loaded:', data.data.length)
        setComplaints(data.data || [])
      } else {
        console.error('Failed to fetch complaints:', data.message)
        setComplaints([])
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setComplaints([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load data on mount and setup auto-refresh
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      router.push('/auth/citizen/login')
      return
    }

    // Initial fetch
    fetchComplaints()

    // Setup auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchComplaints()
    }, 30000)

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

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    completed: complaints.filter(c => c.status === 'completed').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100">Manage and track all your complaints in one place</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/10 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-blue-600"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 overflow-x-auto">
            <Link
              href="/citizen/dashboard"
              className="flex items-center gap-2 py-4 px-4 border-b-3 border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap rounded-t-lg"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/citizen/complaint/create"
              className="flex items-center gap-2 py-4 px-4 border-b-3 border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium whitespace-nowrap rounded-t-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Complaint</span>
            </Link>
            <Link
              href="/citizen/profile"
              className="flex items-center gap-2 py-4 px-4 border-b-3 border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium whitespace-nowrap rounded-t-lg transition-all"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">In Progress</p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
                <RefreshCw className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/citizen/complaint/create" className="w-full group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 cursor-pointer">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Create New Complaint</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">File a new complaint with photos and location</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-500 cursor-pointer">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Track Complaints</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor the status of your complaints</p>
            </CardContent>
          </Card>

          <Link href="/citizen/profile" className="w-full group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-green-500 cursor-pointer">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">My Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and update your profile information</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Complaints Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                My Complaints
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing all {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading your complaints...</p>
              </div>
            </div>
          ) : complaints.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="text-center py-20">
                <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No complaints yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start by creating your first complaint</p>
                <Link href="/citizen/complaint/create">
                  <Button icon={Plus} size="lg" className="shadow-lg">Create Your First Complaint</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <Card key={complaint._id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-400">
                  {/* Complaint Image */}
                  <div className="relative">
                    {complaint.media && complaint.media.length > 0 ? (
                      <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-lg overflow-hidden">
                        {complaint.media[0].type === 'image' ? (
                          <img
                            src={complaint.media[0].url}
                            alt={complaint.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge - Overlay on image */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${
                          statusColors[complaint.status]
                        }`}
                      >
                        {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="mb-2">
                      <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{complaint.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          ID: {complaint._id.slice(-8)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded capitalize">
                          {complaint.category}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Date and Location */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 shrink-0 text-blue-500" />
                        <span className="font-medium">
                          {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-red-500" />
                        <span className="line-clamp-2">
                          {complaint.location.address || 'Location not provided'}
                        </span>
                      </div>
                    </div>

                    {/* Assignment Info */}
                    {(complaint.officeId || complaint.assignedTo) && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {complaint.officeId && (
                          <div className="flex items-start gap-2">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded">
                              <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Office</p>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {complaint.officeId.name}
                              </p>
                            </div>
                          </div>
                        )}

                        {complaint.assignedTo && (
                          <div className="flex items-start gap-2">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded">
                              <User className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Worker</p>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {complaint.assignedTo.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress Photos Count */}
                    {complaint.progressPhotos && complaint.progressPhotos.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-700 dark:text-green-300 flex items-center font-medium">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          {complaint.progressPhotos.length} progress update{complaint.progressPhotos.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {complaint.status === 'rejected' && complaint.rejectionReason && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-xs text-red-700 dark:text-red-300 flex items-start font-medium">
                          <XCircle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{complaint.rejectionReason}</span>
                        </p>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Link href={`/citizen/complaint/${complaint._id}`} className="block">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all font-semibold"
                      >
                        View Full Details →
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
