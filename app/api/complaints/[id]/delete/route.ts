import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireRole } from '@/lib/middleware'
import { deleteMultipleFromCloudinary } from '@/lib/cloudinary'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const complaintId = pathname.split('/').pop()

    if (!complaintId) {
      return NextResponse.json(
        { success: false, message: 'Complaint ID is required' },
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

    // Check permissions
    if (user.role === 'citizen' && complaint.citizenId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You can only delete your own complaints' },
        { status: 403 }
      )
    }

    // Delete associated media from Cloudinary
    const publicIds: string[] = []
    complaint.media.forEach((m) => publicIds.push(m.publicId))
    complaint.progressPhotos.forEach((p) => publicIds.push(p.publicId))

    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds)
    }

    // Delete complaint
    await Complaint.findByIdAndDelete(complaintId)

    return NextResponse.json({
      success: true,
      message: 'Complaint deleted successfully',
    })
  } catch (error) {
    console.error('Delete complaint error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete complaint' },
      { status: 500 }
    )
  }
}

export const DELETE = requireRole(['citizen', 'admin', 'superadmin'], handler)
