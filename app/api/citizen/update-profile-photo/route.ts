import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { getAuthUser } from '@/lib/middleware'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

// POST /api/citizen/update-profile-photo - Update profile photo
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Get authenticated user
    const user = await getAuthUser(req)
    if (!user || user.role !== 'citizen') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('photo') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No photo file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Find citizen
    const citizen = await Citizen.findById(user.id)
    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Citizen not found' },
        { status: 404 }
      )
    }

    // Delete old photo from Cloudinary if exists
    if (citizen.profilePhoto) {
      try {
        await deleteFromCloudinary(citizen.profilePhoto)
      } catch (error) {
        console.error('Error deleting old photo:', error)
      }
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload new photo to Cloudinary
    const uploadResult = await uploadToCloudinary(base64, 'citizen-profiles')
    const photoUrl = uploadResult.url

    // Update citizen profile photo
    citizen.profilePhoto = photoUrl
    await citizen.save()

    return NextResponse.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        profilePhoto: photoUrl,
      },
    })
  } catch (error) {
    console.error('Update profile photo error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update profile photo' },
      { status: 500 }
    )
  }
}
