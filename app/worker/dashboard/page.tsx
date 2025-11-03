'use client'

import { useState } from 'react'
import { Upload, MapPin, LogOut, Calendar, User, CheckCircle, Clock, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/input'

interface Complaint {
  id: string
  title: string
  category: string
  status: 'assigned' | 'started' | 'in-progress' | 'completed'
  date: string
  location: string
  citizen: string
}

export default function WorkerDashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [uploadStage, setUploadStage] = useState<'start' | 'in-progress' | 'completed'>('start')

  const [complaints] = useState<Complaint[]>([
    {
      id: 'C001',
      title: 'Road pothole near Main Street',
      category: 'Road',
      status: 'in-progress',
      date: '2025-11-01',
      location: 'Main Street, Block A',
      citizen: 'John Doe'
    },
    {
      id: 'C005',
      title: 'Broken streetlight',
      category: 'Electricity',
      status: 'assigned',
      date: '2025-11-02',
      location: 'Park Avenue',
      citizen: 'Jane Smith'
    },
    {
      id: 'C007',
      title: 'Garbage pile accumulation',
      category: 'Garbage',
      status: 'started',
      date: '2025-10-30',
      location: '3rd Street',
      citizen: 'Mike Johnson'
    },
  ])

  const statusColors = {
    assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    started: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  const handleUploadPhoto = (complaint: Complaint, stage: 'start' | 'in-progress' | 'completed') => {
    setSelectedComplaint(complaint)
    setUploadStage(stage)
    setIsUploadModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Worker Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your assigned complaints
              </p>
            </div>
            <Button icon={LogOut} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Assigned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5d</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Complaints */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Assigned Complaints
          </h2>
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {complaint.citizen}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {complaint.date}
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
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {complaint.location}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Map Location Placeholder
                    </p>
                    <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Camera}
                    className="flex-1"
                    onClick={() => handleUploadPhoto(complaint, 'start')}
                  >
                    Start Work
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Camera}
                    className="flex-1"
                    onClick={() => handleUploadPhoto(complaint, 'in-progress')}
                  >
                    Update Progress
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    className="flex-1"
                    onClick={() => handleUploadPhoto(complaint, 'completed')}
                  >
                    Mark Complete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={`Upload Photo - ${uploadStage === 'start' ? 'Start Work' : uploadStage === 'in-progress' ? 'In Progress' : 'Completed'}`}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedComplaint.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID: {selectedComplaint.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Upload photos showing the current state of work
              </p>
            </div>

            <Select
              label="Update Status"
              options={[
                { value: 'assigned', label: 'Assigned' },
                { value: 'started', label: 'Started' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <div className="flex gap-4 pt-4">
              <Button type="button" className="flex-1">
                Upload & Update
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
