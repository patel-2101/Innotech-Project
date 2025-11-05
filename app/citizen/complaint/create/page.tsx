'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Mic, MapPin, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'

interface LocationData {
  latitude: number
  longitude: number
  address: string
}

export default function CreateComplaint() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [complaintNumber, setComplaintNumber] = useState('')
  const [error, setError] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    category: '',
    department: '',
    title: '',
    description: '',
    manualLocation: '',
  })
  
  // Location & Media
  const [realTimeLocation, setRealTimeLocation] = useState<LocationData | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      router.push('/auth/citizen/login')
    }
  }, [router])

  // Get real-time location
  const getRealTimeLocation = () => {
    setGettingLocation(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          
          setRealTimeLocation({
            latitude,
            longitude,
            address: data.display_name || `${latitude}, ${longitude}`
          })
        } catch (err) {
          setRealTimeLocation({
            latitude,
            longitude,
            address: `${latitude}, ${longitude}`
          })
        }
        setGettingLocation(false)
      },
      (err) => {
        setError(`Location error: ${err.message}`)
        setGettingLocation(false)
      }
    )
  }

  // Start camera for photo capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      setError('Cannot access camera. Please check permissions.')
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL('image/jpeg')
        setCapturedPhoto(photoData)
        
        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }
    }
  }

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError('Cannot access microphone. Please check permissions.')
    }
  }

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Submit complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        setError('Please login to submit complaint')
        setLoading(false)
        return
      }

      // Prepare FormData
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('department', formData.department)
      submitData.append('category', formData.category)

      // Location data
      if (realTimeLocation) {
        submitData.append('latitude', realTimeLocation.latitude.toString())
        submitData.append('longitude', realTimeLocation.longitude.toString())
        submitData.append('address', realTimeLocation.address)
      } else if (formData.manualLocation) {
        // Use manual location (needs geocoding in backend)
        submitData.append('address', formData.manualLocation)
        submitData.append('latitude', '0')
        submitData.append('longitude', '0')
      }

      // Add captured photo
      if (capturedPhoto) {
        const photoBlob = await fetch(capturedPhoto).then(r => r.blob())
        const photoFile = new File([photoBlob], 'captured-photo.jpg', { type: 'image/jpeg' })
        submitData.append('media', photoFile)
      }

      // Add uploaded files
      uploadedFiles.forEach(file => {
        submitData.append('media', file)
      })

      // Add audio if recorded
      if (audioBlob) {
        const audioFile = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' })
        submitData.append('audio', audioFile)
      }

      const response = await fetch('/api/complaints/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setComplaintNumber(data.data.complaintId)
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/citizen/dashboard')
        }, 3000)
      } else {
        setError(data.message || 'Failed to submit complaint')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Complaint Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your complaint has been registered successfully
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Complaint Number</p>
              <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {complaintNumber}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You will be notified about the status of your complaint
            </p>
            <Button onClick={() => router.push('/citizen/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/citizen/dashboard">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Complaint
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill in the details to register your complaint
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* 1. Category Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  1. Select Category
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'road', label: 'Road', icon: '🛣️', dept: 'road' },
                    { value: 'water', label: 'Water Supply', icon: '💧', dept: 'water' },
                    { value: 'sewage', label: 'Sewage', icon: '🚰', dept: 'sewage' },
                    { value: 'electricity', label: 'Electricity', icon: '⚡', dept: 'electricity' },
                    { value: 'garbage', label: 'Garbage', icon: '🗑️', dept: 'garbage' },
                    { value: 'other', label: 'Other', icon: '📋', dept: 'other' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value, department: cat.dept })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.category === cat.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {cat.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Complaint Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  2. Complaint Title
                </h3>
                <Input
                  type="text"
                  placeholder="Brief description of your complaint"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* 3. Description or Voice Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  3. Description or Voice Message
                </h3>
                <Textarea
                  placeholder="Provide detailed information about the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required={!audioBlob}
                />
                
                <div className="mt-3">
                  <Button
                    type="button"
                    variant={isRecording ? 'danger' : 'outline'}
                    className="w-full"
                    onClick={isRecording ? stopRecording : startRecording}
                    icon={Mic}
                  >
                    {isRecording ? 'Stop Recording' : audioBlob ? '✓ Voice Recorded - Record Again?' : 'Record Voice Message'}
                  </Button>
                  {audioBlob && !isRecording && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
                      ✓ Voice message recorded successfully
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Manual Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  4. Manual Location
                </h3>
                <Input
                  type="text"
                  placeholder="Enter location address (e.g., Street name, Area, City)"
                  value={formData.manualLocation}
                  onChange={(e) => setFormData({ ...formData, manualLocation: e.target.value })}
                  icon={MapPin}
                />
              </div>

              {/* 5. Real-time Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  5. Real-time Location (GPS)
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={getRealTimeLocation}
                  disabled={gettingLocation}
                  icon={gettingLocation ? Loader2 : MapPin}
                >
                  {gettingLocation ? 'Getting Location...' : realTimeLocation ? '✓ Location Captured - Update?' : 'Get Current GPS Location'}
                </Button>
                {realTimeLocation && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                      Location Captured:
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {realTimeLocation.address}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Lat: {realTimeLocation.latitude.toFixed(6)}, Long: {realTimeLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* 6. Real-time Photo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  6. Capture Photo (Camera)
                </h3>
                
                {!capturedPhoto ? (
                  <div className="space-y-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-gray-900"
                      style={{ display: videoRef.current?.srcObject ? 'block' : 'none' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    
                    {!videoRef.current?.srcObject ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={startCamera}
                        icon={Camera}
                      >
                        Start Camera
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={capturePhoto}
                        icon={Camera}
                      >
                        Capture Photo
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCapturedPhoto(null)
                        startCamera()
                      }}
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}

                {/* Additional file upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or Upload Files (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Submit & Cancel Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.category || !formData.title}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/citizen/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
