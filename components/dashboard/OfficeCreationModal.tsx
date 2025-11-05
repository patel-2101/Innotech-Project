'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle, Copy } from 'lucide-react'

interface OfficeCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function OfficeCreationModal({ isOpen, onClose, onSuccess }: OfficeCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    userId: string
    password: string
    phone: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Authentication required. Please login again.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/offices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setGeneratedCredentials({
          userId: data.data.userId,
          password: data.data.generatedPassword,
          phone: data.data.phone,
        })
        // Call onSuccess callback to refresh office list
        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          setError('Authentication failed. Please logout and login again.')
        } else if (response.status === 403) {
          setError('Access denied. You need admin privileges to create offices.')
        } else if (data.errors) {
          setError(data.errors.map((e: { message: string }) => e.message).join(', '))
        } else {
          setError(data.message || 'Failed to create office')
        }
      }
    } catch (err) {
      setError('Network error occurred. Please check your connection and try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', department: '', phone: '', email: '' })
    setError('')
    setSuccess(false)
    setGeneratedCredentials(null)
    onClose()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={success ? 'Office Created Successfully!' : 'Create New Office Login'}
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <Input
            label="Office Name"
            type="text"
            placeholder="Enter office name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Department/Category"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: '', label: 'Select Department' },
              { value: 'road', label: 'Road' },
              { value: 'water', label: 'Water' },
              { value: 'sewage', label: 'Sewage' },
              { value: 'electricity', label: 'Electricity' },
              { value: 'garbage', label: 'Garbage' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <Input
            label="Mobile Number"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            maxLength={10}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Login ID and Password will be auto-generated</li>
              <li>Credentials will be sent via SMS to the mobile number</li>
              <li>Office can reset password using forgot password option</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Office'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded">
            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
              Office account created successfully! SMS sent to {generatedCredentials?.phone}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded space-y-3">
            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
              Generated Login Credentials:
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Login ID:</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">
                    {generatedCredentials?.userId}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedCredentials?.userId || '')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Password:</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">
                    {generatedCredentials?.password}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedCredentials?.password || '')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              ⚠️ Save these credentials securely. They have been sent via SMS.
            </p>
          </div>

          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      )}
    </Modal>
  )
}
