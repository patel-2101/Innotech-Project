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

  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Worker' : 'Worker'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0wIDMwdi0yaC0ydjJoMnpNNiAzNnY0SDR2LTRoMnptMC0zMGg0VjRINnYyem0wIDBoLTJ2LTJoMnYyem0zMCAwdjJoLTJ2LTJoMnptLTMwIDBoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👷</h1>
              <p className="text-blue-100 text-lg">Manage your assigned tasks efficiently</p>
            </div>
            <Button
              onClick={fetchAssignedComplaints}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Assigned</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">In Progress</p>
                <p className="text-4xl font-bold mt-2">{stats.inProgress}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <Upload className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-4xl font-bold mt-2">{stats.completed}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading assigned complaints...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Tasks</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button onClick={fetchAssignedComplaints} className="bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
          </div>
        )}

        {/* Assigned Complaints */}
        {!loading && !error && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Assigned Tasks ({complaints.length})
              </h2>
            </div>
            {complaints.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Tasks Assigned</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You don't have any complaints assigned yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {complaint.media && complaint.media.length > 0 ? (
                        <img
                          src={complaint.media[0].url}
                          alt={complaint.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
                            statusColors[complaint.status]
                          }`}
                        >
                          {complaint.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {complaint.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {complaint.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {complaint.citizenId?.name || 'Unknown Citizen'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                            {complaint.location?.address || 'Location not specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg">
                            <span className="text-purple-700 dark:text-purple-300 font-semibold">
                              {complaint.department.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {complaint.status === 'assigned' && (
                          <Button
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                            onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                            disabled={updatingStatus}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Start Work
                          </Button>
                        )}
                        {complaint.status === 'in-progress' && (
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                            onClick={() => handleStatusUpdate(complaint._id, 'completed')}
                            disabled={updatingStatus}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                        {complaint.status === 'completed' && (
                          <div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg py-3 text-center">
                            <span className="text-green-700 dark:text-green-400 font-semibold flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
