import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireCitizen } from '@/lib/middleware'
import { validateRequest, complaintSchema } from '@/lib/validation'
import { uploadToCloudinary } from '@/lib/cloudinary'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await connectDB()

    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const department = formData.get('department') as string
    const category = formData.get('category') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)
    const address = formData.get('address') as string || ''

    // Validate basic fields
    const validation = validateRequest(complaintSchema, {
      title,
      description,
      department,
      category,
      latitude,
      longitude,
      address,
    })

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    // Process media files (images/videos)
    const mediaFiles: { type: string; url: string; publicId: string }[] = []
    const files = formData.getAll('media')

    for (const file of files) {
      if (file instanceof File) {
        // Convert file to base64 or buffer for Cloudinary
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(base64, 'complaints')
        
        mediaFiles.push({
          type: uploadResult.resourceType,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        })
      }
    }

    // Create complaint
    const complaint = new Complaint({
      citizenId: user.id,
      title,
      description,
      department,
      category,
      media: mediaFiles,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      address,
      status: 'pending',
    })

    await complaint.save()

    return NextResponse.json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        complaintId: complaint._id,
        status: complaint.status,
      },
    })
  } catch (error) {
    console.error('Create complaint error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create complaint' },
      { status: 500 }
    )
  }
}

export const POST = requireCitizen(handler)
