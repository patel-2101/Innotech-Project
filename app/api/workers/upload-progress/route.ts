import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireWorker } from '@/lib/middleware'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { isWithinAllowedDistance } from '@/lib/geolocation'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await connectDB()

    const formData = await request.formData()
    
    const complaintId = formData.get('complaintId') as string
    const stage = formData.get('stage') as string
    const workerLat = parseFloat(formData.get('latitude') as string)
    const workerLon = parseFloat(formData.get('longitude') as string)

    if (!complaintId || !stage || isNaN(workerLat) || isNaN(workerLon)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find complaint
    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return NextResponse.json(
        { success: false, message: 'Complaint not found' },
        { status: 404 }
      )
    }

    // Check if worker is assigned to this complaint
    if (complaint.assignedTo?.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You are not assigned to this complaint' },
        { status: 403 }
      )
    }

    // Get complaint location
    const complaintLat = complaint.location.coordinates[1]
    const complaintLon = complaint.location.coordinates[0]

    // Check if worker is within 10 meters of complaint location
    const isNearby = isWithinAllowedDistance(
      workerLat,
      workerLon,
      complaintLat,
      complaintLon,
      10 // 10 meters
    )

    if (!isNearby) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be within 10 meters of the complaint location to upload progress photos',
        },
        { status: 403 }
      )
    }

    // Process photo file
    const file = formData.get('photo') as File
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Photo is required' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(base64, 'progress')

    // Add progress photo to complaint (description not in schema, removed)
    complaint.progressPhotos.push({
      stage: stage as 'start' | 'in-progress' | 'completed',
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedAt: new Date(),
      location: {
        type: 'Point',
        coordinates: [workerLon, workerLat],
      },
    })

    await complaint.save()

    return NextResponse.json({
      success: true,
      message: 'Progress photo uploaded successfully',
      data: {
        complaintId: complaint._id,
        stage,
        photoUrl: uploadResult.url,
      },
    })
  } catch (error) {
    console.error('Upload progress photo error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload progress photo' },
      { status: 500 }
    )
  }
}

export const POST = requireWorker(handler)
