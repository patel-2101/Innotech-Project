import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireWorker } from '@/lib/middleware'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { complaintId, status } = body

    if (!complaintId || !status) {
      return NextResponse.json(
        { success: false, message: 'Complaint ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['assigned', 'in-progress', 'completed', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
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

    // Update status
    complaint.status = status
    if (status === 'completed') {
      complaint.completedAt = new Date()
    }
    await complaint.save()

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: {
        complaintId: complaint._id,
        status: complaint.status,
      },
    })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    )
  }
}

export const PUT = requireWorker(handler)
