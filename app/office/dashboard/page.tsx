'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, AlertCircle, CheckCircle, Clock, XCircle, MapPin, Image as ImageIcon } from 'lucide-react'
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaints...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardHeader
          title="Office Dashboard"
          subtitle="Manage department complaints and assign workers"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">{error}</p>
                <Button onClick={fetchComplaints} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader
        title="Office Dashboard"
        subtitle="Manage department complaints and assign workers"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
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
                <AlertCircle className="w-8 h-8 text-purple-600" />
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Department Complaints ({complaints.length})
            </h2>
            <Button onClick={fetchComplaints} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          {complaints.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No complaints found for your department</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Citizen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {complaints.map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {complaint.title}
                            {complaint.media && complaint.media.length > 0 && (
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1 max-w-xs">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{complaint.location?.address || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {complaint.citizenId?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              statusColors[complaint.status]
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {complaint.assignedTo?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(complaint)}
                          >
                            View
                          </Button>
                          {complaint.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={UserPlus}
                              onClick={() => openAssignModal(complaint)}
                            >
                              Assign
                            </Button>
                          )}
                          {(complaint.status === 'assigned' || complaint.status === 'in-progress') && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={UserPlus}
                              onClick={() => openAssignModal(complaint)}
                            >
                              Reassign
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
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
