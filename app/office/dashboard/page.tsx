'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, AlertCircle, CheckCircle, Clock, XCircle, MapPin, Image as ImageIcon, User, Calendar } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/input'

interface Complaint {
  _id: string
  title: string
  description: string
  category: string
  department: string
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected'
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
  assignedTo?: {
    name: string
    employeeId: string
  }
  priority?: string
}

interface Worker {
  _id: string
  name: string
  employeeId: string
  department: string
}

export default function OfficeDashboard() {
  const router = useRouter()
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('medium')
  const [assigning, setAssigning] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    
    if (!token || role !== 'office') {
      router.push('/auth/office/page')
      return
    }
  }, [router])

  // Fetch complaints
  useEffect(() => {
    fetchComplaints()
    fetchWorkers()
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      if (!token) {
        setError('Not authenticated. Please login again.')
        return
      }

      const response = await fetch('/api/complaints/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setComplaints(data.data)
      } else {
        setError(data.message || 'Failed to load complaints')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Fetch complaints error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkers = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      if (!token) {
        return
      }

      const response = await fetch('/api/workers/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setWorkers(data.data)
      }
    } catch (err) {
      console.error('Fetch workers error:', err)
    }
  }

  const handleAssignWorker = async () => {
    if (!selectedComplaint || !selectedWorker) return

    try {
      setAssigning(true)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      if (!token) {
        alert('Authentication required. Please login again.')
        return
      }

      const response = await fetch('/api/complaints/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId: selectedComplaint._id,
          workerId: selectedWorker,
          priority: selectedPriority,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh complaints list
        await fetchComplaints()
        setIsAssignModalOpen(false)
        setSelectedWorker('')
        setSelectedPriority('medium')
      } else {
        alert(data.message || 'Failed to assign worker')
      }
    } catch (err) {
      alert('Failed to assign worker')
      console.error('Assign worker error:', err)
    } finally {
      setAssigning(false)
    }
  }

  // Calculate stats
  const stats = {
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress' || c.status === 'assigned').length,
    completed: complaints.filter(c => c.status === 'completed').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const openAssignModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsAssignModalOpen(true)
  }

  const openDetailModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsDetailModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading complaints...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0wIDMwdi0yaC0ydjJoMnpNNiAzNnY0SDR2LTRoMnptMC0zMGg0VjRINnYyem0wIDBoLTJ2LTJoMnYyem0zMCAwdjJoLTJ2LTJoMnptLTMwIDBoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            <h1 className="text-4xl font-bold mb-2">Office Dashboard 🏢</h1>
            <p className="text-purple-100 text-lg">Manage department complaints and assign workers</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button onClick={fetchComplaints} className="bg-purple-600 hover:bg-purple-700 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Office' : 'Office'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0wIDMwdi0yaC0ydjJoMnpNNiAzNnY0SDR2LTRoMnptMC0zMGg0VjRINnYyem0wIDBoLTJ2LTJoMnYyem0zMCAwdjJoLTJ2LTJoMnptLTMwIDBoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 🏢</h1>
              <p className="text-purple-100 text-lg">Manage department complaints and assign workers</p>
            </div>
            <Button
              onClick={fetchComplaints}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 -mt-8">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-4xl font-bold mt-2">{stats.pending}</p>
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
                <AlertCircle className="w-8 h-8" />
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
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Rejected</p>
                <p className="text-4xl font-bold mt-2">{stats.rejected}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <XCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Department Complaints ({complaints.length})
            </h2>
          </div>
          {complaints.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Complaints</h3>
              <p className="text-gray-500 dark:text-gray-400">No complaints found for your department</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  {/* Image Section */}
                  <div className="relative h-40 overflow-hidden">
                    {complaint.media && complaint.media.length > 0 ? (
                      <img
                        src={complaint.media[0].url}
                        alt={complaint.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-purple-400" />
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
                    {complaint.media && complaint.media.length > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {complaint.media.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {complaint.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                          {complaint.citizenId?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs line-clamp-1">
                          {complaint.location?.address || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                          <span className="text-orange-700 dark:text-orange-300 text-xs font-semibold">
                            {complaint.category}
                          </span>
                        </div>
                      </div>
                      {complaint.assignedTo && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg mt-2">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                              {complaint.assignedTo.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailModal(complaint)}
                        className="flex-1 text-xs"
                      >
                        View Details
                      </Button>
                      {complaint.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => openAssignModal(complaint)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5 mr-1" />
                          Assign
                        </Button>
                      )}
                      {(complaint.status === 'assigned' || complaint.status === 'in-progress') && (
                        <Button
                          size="sm"
                          onClick={() => openAssignModal(complaint)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5 mr-1" />
                          Reassign
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Worker Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedWorker('')
          setSelectedPriority('medium')
        }}
        title={selectedComplaint?.status === 'pending' ? 'Assign Worker' : 'Reassign Worker'}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedComplaint.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Category: {selectedComplaint.category} | Department: {selectedComplaint.department}
              </p>
              {selectedComplaint.assignedTo && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Currently assigned to: <span className="font-medium">{selectedComplaint.assignedTo.name}</span>
                </p>
              )}
            </div>

            <Select
              label="Select Worker"
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              options={[
                { value: '', label: 'Choose a worker' },
                ...workers
                  .filter(w => w.department === selectedComplaint.department)
                  .map(w => ({
                    value: w._id,
                    label: `${w.name} - ${w.employeeId}`
                  }))
              ]}
            />

            <Select
              label="Priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              options={[
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                className="flex-1"
                onClick={handleAssignWorker}
                disabled={!selectedWorker || assigning}
              >
                {assigning ? 'Assigning...' : selectedComplaint.status === 'pending' ? 'Assign Worker' : 'Reassign Worker'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAssignModalOpen(false)
                  setSelectedWorker('')
                  setSelectedPriority('medium')
                }}
                disabled={assigning}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Complaint Details"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedComplaint.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedComplaint.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedComplaint.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    statusColors[selectedComplaint.status]
                  }`}
                >
                  {selectedComplaint.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedComplaint.priority || 'medium'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
              <div className="flex items-start gap-2 text-sm text-gray-900 dark:text-white">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{selectedComplaint.location?.address || 'N/A'}</span>
              </div>
              {selectedComplaint.location?.coordinates && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  {selectedComplaint.location.coordinates[1].toFixed(6)}, {selectedComplaint.location.coordinates[0].toFixed(6)}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Citizen</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedComplaint.citizenId?.name || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedComplaint.citizenId?.email || ''}
              </p>
            </div>

            {selectedComplaint.assignedTo && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned Worker</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedComplaint.assignedTo.name} - {selectedComplaint.assignedTo.employeeId}
                </p>
              </div>
            )}

            {selectedComplaint.media && selectedComplaint.media.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Media Attachments</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedComplaint.media.map((item, index) => (
                    <div key={index} className="relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(selectedComplaint.createdAt).toLocaleString()}
              </p>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
