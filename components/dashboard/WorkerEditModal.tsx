'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Worker {
  _id: string
  name: string
  userId: string
  plainPassword?: string
  department: string
  phone: string
  email: string
  status: string
}

interface WorkerEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  worker: Worker | null
}

export function WorkerEditModal({ isOpen, onClose, onSuccess, worker }: WorkerEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    status: '',
    phone: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Populate form when worker changes
  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name || '',
        department: worker.department || '',
        status: worker.status || 'active',
        phone: worker.phone || '',
        email: worker.email || '',
        password: '', // Don't pre-fill password for security
      })
    }
  }, [worker])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!worker) return

    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      // Only include fields that have values
      const updateData: Record<string, string> = {}
      if (formData.name !== worker.name) updateData.name = formData.name
      if (formData.department !== worker.department) updateData.department = formData.department
      if (formData.status !== worker.status) updateData.status = formData.status
      if (formData.phone !== worker.phone) updateData.phone = formData.phone
      if (formData.email !== worker.email) updateData.email = formData.email
      if (formData.password) updateData.password = formData.password

      const response = await fetch(`/api/workers/${worker._id}/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
        onClose()
        setFormData({
          name: '',
          department: '',
          status: '',
          phone: '',
          email: '',
          password: '',
        })
      } else {
        setError(data.message || 'Failed to update worker')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Worker - ${worker?.userId}`}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Worker Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Select
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          options={[
            { value: 'road', label: 'Road' },
            { value: 'water', label: 'Water' },
            { value: 'sewage', label: 'Sewage' },
            { value: 'electricity', label: 'Electricity' },
            { value: 'garbage', label: 'Garbage' },
            { value: 'other', label: 'Other' },
          ]}
          required
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          required
        />

        <Input
          label="Phone (10 digits)"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          pattern="[0-9]{10}"
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="New Password (leave blank to keep current)"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter new password if changing"
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Worker'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
