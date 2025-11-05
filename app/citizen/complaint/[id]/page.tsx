'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, MapPin, FileText, User, Building2, 
  CheckCircle, Clock, AlertCircle, XCircle, Star, Image as ImageIcon,
  RefreshCw
} from 'lucide-react'
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

export default function ComplaintDetails() {
  const router = useRouter()
  const params = useParams()
  const complaintId = params.id as string

  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchComplaintDetails = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        router.push('/auth/citizen/login')
        return
      }

      const response = await fetch(`/api/complaints/${complaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setComplaint(data.data)
      } else {
        setError(data.message || 'Failed to fetch complaint details')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchComplaintDetails()

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchComplaintDetails()
    }, 15000)

    return () => clearInterval(interval)
  }, [complaintId, router])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchComplaintDetails()
  }

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
    assigned: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: FileText },
    'in-progress': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: RefreshCw },
    completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading complaint details...</div>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white mb-4">{error || 'Complaint not found'}</p>
            <Link href="/citizen/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatusIcon = statusConfig[complaint.status].icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/citizen/dashboard">
                <Button variant="outline" size="sm" icon={ArrowLeft}>
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Complaint Details
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {complaint._id}
                </p>
              </div>
            </div>
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                  <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${statusConfig[complaint.status].color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {complaint.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description:</p>
                  <p className="text-gray-600 dark:text-gray-400">{complaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{complaint.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{complaint.priority || 'Medium'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {complaint.location.address || 'Location not provided'}
                  </p>
                  {complaint.location.coordinates && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Coordinates: {complaint.location.coordinates[1].toFixed(6)}, {complaint.location.coordinates[0].toFixed(6)}
                    </p>
                  )}
                </div>

                {/* Rejection Reason */}
                {complaint.status === 'rejected' && complaint.rejectionReason && (
                  <div className="pt-4 border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 rounded">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">{complaint.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submitted Media */}
            {complaint.media && complaint.media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submitted Media ({complaint.media.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {complaint.media.map((item, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Photos from Worker */}
            {complaint.progressPhotos && complaint.progressPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Progress Updates ({complaint.progressPhotos.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Photos uploaded by assigned worker
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaint.progressPhotos.map((photo, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            photo.stage === 'start' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            photo.stage === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {photo.stage === 'start' ? 'Work Started' : 
                             photo.stage === 'in-progress' ? 'In Progress' : 
                             'Work Completed'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(photo.uploadedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img
                            src={photo.url}
                            alt={`Progress ${photo.stage}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Assigned to Office */}
                  {complaint.officeId && (
                    <div className="flex items-start gap-3 border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-7">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 -ml-8">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Assigned to Office</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{complaint.officeId.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(complaint.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Assigned to Worker */}
                  {complaint.assignedTo && (
                    <div className="flex items-start gap-3 border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-7">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 -ml-8">
                        <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Assigned to Worker</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{complaint.assignedTo.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(complaint.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Completed */}
                  {complaint.status === 'completed' && complaint.completedAt && (
                    <div className="flex items-start gap-3 border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-7">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 -ml-8">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(complaint.completedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Office Details */}
            {complaint.officeId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Office Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Office Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.officeId.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{complaint.officeId.department}</p>
                  </div>
                  {complaint.officeId.phone && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.officeId.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Worker Details */}
            {complaint.assignedTo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Worker Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Worker Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.assignedTo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{complaint.assignedTo.department}</p>
                  </div>
                  {complaint.assignedTo.phone && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.assignedTo.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Rating Section */}
            {complaint.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complaint.rating ? (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= complaint.rating!
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      {complaint.feedback && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {complaint.feedback}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button className="w-full" size="sm">
                      Rate This Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
