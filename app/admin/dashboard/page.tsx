'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, Building2, Briefcase, FileText, BarChart } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'

type TabType = 'overview' | 'offices' | 'workers' | 'citizens' | 'complaints' | 'categories'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'offices', label: 'Offices', icon: Building2 },
    { id: 'workers', label: 'Workers', icon: Briefcase },
    { id: 'citizens', label: 'Citizens', icon: Users },
    { id: 'complaints', label: 'Complaints', icon: FileText },
    { id: 'categories', label: 'Categories', icon: Edit },
  ]

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
                Manage Offices
              </h2>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Office
              </Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Office Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {['Office A', 'Office B', 'Office C'].map((office, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          OFF{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {office}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          Public Works
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          District {index + 1}
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
              </div>
            </Card>
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Workers
              </h2>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Worker
              </Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Worker ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Assigned Office
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
                    {['John Smith', 'Sarah Johnson', 'Mike Davis'].map((name, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          W{String(index + 123).padStart(3, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          Road Maintenance
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          Office A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
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
              </div>
            </Card>
          </div>
        )}

        {/* Citizens Tab */}
        {activeTab === 'citizens' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Citizens
              </h2>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Citizen ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Total Complaints
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          CIT{String(index + 1001).padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {name.toLowerCase().replace(' ', '.')}@email.com
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          +1 555-{String(index + 1234).padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {5 + index * 2}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="danger" size="sm" icon={Trash2}>
                            Deactivate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* Generic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add ${activeTab === 'offices' ? 'Office' : activeTab === 'workers' ? 'Worker' : 'Category'}`}
      >
        <form className="space-y-4">
          <Input label="Name" type="text" placeholder="Enter name" required />
          {activeTab === 'offices' && (
            <>
              <Input label="Department" type="text" placeholder="Enter department" required />
              <Input label="Location" type="text" placeholder="Enter location" required />
            </>
          )}
          {activeTab === 'workers' && (
            <>
              <Select
                label="Department"
                options={[
                  { value: '', label: 'Select Department' },
                  { value: 'road', label: 'Road Maintenance' },
                  { value: 'water', label: 'Water Supply' },
                  { value: 'sewage', label: 'Sewage Management' },
                ]}
              />
              <Select
                label="Assign to Office"
                options={[
                  { value: '', label: 'Select Office' },
                  { value: 'off1', label: 'Office A' },
                  { value: 'off2', label: 'Office B' },
                ]}
              />
            </>
          )}
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
    </div>
  )
}
