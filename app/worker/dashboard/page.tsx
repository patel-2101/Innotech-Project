'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, MapPin, Calendar, User, CheckCircle, Clock } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

interface Complaint {
  _id: string
  title: string
  description: string
  category: string
  department: string
  status: 'assigned' | 'in-progress' | 'completed' | 'rejected'
  createdAt: string
  citizenId: {
    name: string
    email: string
  }
  location: {
    address: string
    coordinates: [number, number]
  }
  media?: Array<{
    type: string
    url: string
  }>
}

export default function WorkerDashboard() {
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    
    if (!token || role !== 'worker') {
      router.push('/auth/worker/page')
      return
    }

    fetchAssignedComplaints()
  }, [router])

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      
      console.log('Fetching worker assigned complaints...')
      const response = await fetch('/api/workers/assigned-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Worker complaints response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch assigned complaints')
      }

      const data = await response.json()
      console.log('Worker complaints data:', data)
      
      if (data.success && data.data) {
        setComplaints(data.data)
        console.log('Assigned complaints loaded:', data.data.length)
      }
    } catch (err) {
      console.error('Error fetching assigned complaints:', err)
      setError(err instanceof Error ? err.message : 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const stats = {
    total: complaints.length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    completed: complaints.filter(c => c.status === 'completed').length,
  }

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      
      console.log(`Updating complaint ${complaintId} to status: ${newStatus}`)
      const response = await fetch('/api/complaints/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId,
          status: newStatus
        })
      })

      console.log('Status update response:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update status')
      }

      const data = await response.json()
      console.log('Status updated successfully:', data)
      
      // Refresh complaints list
      await fetchAssignedComplaints()
      setIsUploadModalOpen(false)
      alert('Status updated successfully!')
    } catch (err) {
      console.error('Error updating status:', err)
      alert(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader
        title="Worker Dashboard"
        subtitle="Manage your assigned complaints"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Assigned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                </div>
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading assigned complaints...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400">{error}</div>
            <Button onClick={fetchAssignedComplaints} className="mt-4">Retry</Button>
          </div>
        )}

        {/* Assigned Complaints */}
        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Assigned Complaints ({complaints.length})
            </h2>
            {complaints.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No complaints assigned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <Card key={complaint._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{complaint.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {complaint.citizenId?.name || 'Unknown Citizen'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                              {complaint.department.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            statusColors[complaint.status]
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {complaint.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {complaint.location?.address || 'Location not specified'}
                      </div>
                      {complaint.media && complaint.media.length > 0 && (
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Complaint Photos
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {complaint.media.map((media, idx) => (
                              <img
                                key={idx}
                                src={media.url}
                                alt={`Complaint photo ${idx + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {complaint.status === 'assigned' && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Upload}
                          className="flex-1"
                          onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                          disabled={updatingStatus}
                        >
                          Start Work
                        </Button>
                      )}
                      {complaint.status === 'in-progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle}
                          className="flex-1"
                          onClick={() => handleStatusUpdate(complaint._id, 'completed')}
                          disabled={updatingStatus}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {complaint.status === 'completed' && (
                        <div className="flex-1 text-center py-2 text-sm text-green-600 dark:text-green-400">
                          ✓ Completed
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
