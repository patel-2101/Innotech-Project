'use client'

import { useState } from 'react'
import React from 'react'
import { Plus, Edit, Trash2, Users, Building2, Briefcase, FileText, BarChart } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { OfficeCreationModal } from '@/components/dashboard/OfficeCreationModal'
import { WorkerCreationModal } from '@/components/dashboard/WorkerCreationModal'

type TabType = 'overview' | 'offices' | 'workers' | 'citizens' | 'complaints' | 'categories'

interface Office {
  _id: string
  name: string
  userId: string
  plainPassword?: string
  department: string
  phone: string
  email: string
  location?: string
  workers?: unknown[]
  complaints?: unknown[]
  createdAt: string
}

interface Worker {
  _id: string
  name: string
  userId: string
  department: string
  phone: string
  email: string
  status: string
  assignedTasks?: unknown[]
  createdAt: string
}

interface Citizen {
  _id: string
  name: string
  phone: string
  email: string
  address?: string
  profilePhoto?: string
  verified: boolean
  createdAt: string
  statistics: {
    totalComplaints: number
    solvedComplaints: number
    rejectedComplaints: number
    pendingComplaints: number
    averageRating: number
    ratedComplaintsCount: number
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [offices, setOffices] = useState<Office[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [loadingOffices, setLoadingOffices] = useState(false)
  const [loadingWorkers, setLoadingWorkers] = useState(false)
  const [loadingCitizens, setLoadingCitizens] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'offices', label: 'Offices', icon: Building2 },
    { id: 'workers', label: 'Workers', icon: Briefcase },
    { id: 'citizens', label: 'Citizens', icon: Users },
    { id: 'complaints', label: 'Complaints', icon: FileText },
    { id: 'categories', label: 'Categories', icon: Edit },
  ]

  // Fetch offices from database
  const fetchOffices = async () => {
    setLoadingOffices(true)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        console.error('No authentication token found')
        return
      }
      const response = await fetch('/api/offices/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setOffices(data.data)
      } else {
        console.error('Failed to fetch offices:', data.message)
      }
    } catch (error) {
      console.error('Failed to fetch offices:', error)
    } finally {
      setLoadingOffices(false)
    }
  }

  // Fetch workers from database
  const fetchWorkers = async () => {
    setLoadingWorkers(true)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        console.error('No authentication token found')
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
      } else {
        console.error('Failed to fetch workers:', data.message)
      }
    } catch (error) {
      console.error('Failed to fetch workers:', error)
    } finally {
      setLoadingWorkers(false)
    }
  }

  // Fetch citizens from database with complaint statistics
  const fetchCitizens = async () => {
    setLoadingCitizens(true)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      const role = localStorage.getItem('role') || localStorage.getItem('userRole')
      
      console.log('Fetching citizens with token:', token ? 'Token exists' : 'No token')
      console.log('User role:', role)
      
      if (!token) {
        console.error('No authentication token found')
        alert('Session expired. Please login again.')
        return
      }
      
      const response = await fetch('/api/admin/citizens', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        setCitizens(data.data)
        console.log('Citizens loaded:', data.data.length)
      } else {
        console.error('Failed to fetch citizens:', data.message)
        if (response.status === 401 || response.status === 403) {
          alert(`Access Error: ${data.message}. Please re-login.`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch citizens:', error)
      alert('Network error while fetching citizens')
    } finally {
      setLoadingCitizens(false)
    }
  }

  // Fetch data when respective tab is active
  React.useEffect(() => {
    if (activeTab === 'offices') {
      fetchOffices()
    } else if (activeTab === 'workers') {
      fetchWorkers()
    } else if (activeTab === 'citizens') {
      fetchCitizens()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="System administration and management"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Citizens</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Workers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Offices</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                    </div>
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">456</p>
                    </div>
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">45</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Assigned</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">78</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">123</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">210</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Road', 'Water', 'Sewage', 'Electricity', 'Garbage'].map((category, index) => {
                    const values = [92, 78, 56, 43, 31]
                    const colors = ['bg-red-500', 'bg-blue-500', 'bg-brown-500', 'bg-yellow-500', 'bg-green-500']
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {category}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {values[index]}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`${colors[index]} h-2 rounded-full`}
                            style={{ width: `${(values[index] / 92) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Offices Tab */}
        {activeTab === 'offices' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Offices ({offices.length})
              </h2>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Office
              </Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                {loadingOffices ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">Loading offices...</div>
                  </div>
                ) : offices.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <Building2 className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No offices created yet</p>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                      Create First Office
                    </Button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Login ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Office Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Password
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Workers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {offices.map((office) => (
                        <tr key={office._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                            {office.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {office.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              office.department === 'road' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              office.department === 'water' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              office.department === 'sewage' ? 'bg-brown-100 text-brown-800 dark:bg-brown-900 dark:text-brown-200' :
                              office.department === 'electricity' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              office.department === 'garbage' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {office.department.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {office.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {office.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white font-mono text-xs">
                                {office.plainPassword || '••••••••'}
                              </code>
                              {office.plainPassword && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(office.plainPassword!)
                                    alert('Password copied to clipboard!')
                                  }}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Copy Password"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {office.workers?.length || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            <Button variant="outline" size="sm" icon={Edit}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" icon={Trash2}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Workers ({workers.length})
              </h2>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Worker
              </Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                {loadingWorkers ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">Loading workers...</div>
                  </div>
                ) : workers.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No workers created yet</p>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                      Create First Worker
                    </Button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Login ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {workers.map((worker) => (
                        <tr key={worker._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                            {worker.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {worker.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              worker.department === 'road' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              worker.department === 'water' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              worker.department === 'sewage' ? 'bg-brown-100 text-brown-800 dark:bg-brown-900 dark:text-brown-200' :
                              worker.department === 'electricity' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              worker.department === 'garbage' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {worker.department.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {worker.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {worker.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              worker.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {worker.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            <Button variant="outline" size="sm" icon={Edit}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" icon={Trash2}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Citizens Tab */}
        {activeTab === 'citizens' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Citizens ({citizens.length})
              </h2>
            </div>
            <Card>
              <div className="overflow-x-auto">
                {loadingCitizens ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">Loading citizens...</div>
                  </div>
                ) : citizens.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No citizens registered yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Solved
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Pending
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Rejected
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {citizens.map((citizen) => (
                        <tr key={citizen._id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10">
                                {citizen.profilePhoto ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={citizen.profilePhoto}
                                    alt={citizen.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-200 font-semibold text-sm">
                                      {citizen.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {citizen.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {citizen._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {citizen.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {citizen.phone}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {citizen.statistics.totalComplaints}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {citizen.statistics.solvedComplaints}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {citizen.statistics.pendingComplaints}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {citizen.statistics.rejectedComplaints}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {citizen.statistics.averageRating > 0 
                                  ? citizen.statistics.averageRating.toFixed(1)
                                  : 'N/A'
                                }
                              </span>
                              {citizen.statistics.ratedComplaintsCount > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({citizen.statistics.ratedComplaintsCount})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Categories
              </h2>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Category
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Road', 'Water', 'Sewage', 'Electricity', 'Garbage', 'Other'].map((category, idx) => (
                <Card key={category} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category}
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 dark:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Complaints: {[92, 78, 56, 43, 31, 15][idx]}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Office Creation Modal */}
      <OfficeCreationModal 
        isOpen={isModalOpen && activeTab === 'offices'}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOffices}
      />

      {/* Worker Creation Modal */}
      <WorkerCreationModal 
        isOpen={isModalOpen && activeTab === 'workers'}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWorkers}
      />

      {/* Generic Modal for other tabs */}
      {activeTab !== 'offices' && activeTab !== 'workers' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Category"
        >
          <form className="space-y-4">
            <Input label="Name" type="text" placeholder="Enter name" required />
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
