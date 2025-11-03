import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'
import { Types } from 'mongoose'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await connectDB()

    const body = await request.json()
    const { complaintId, workerId } = body

    if (!complaintId || !workerId) {
      return NextResponse.json(
        { success: false, message: 'Complaint ID and Worker ID are required' },
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

    // Check if already assigned
    if (complaint.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Complaint already assigned or completed' },
        { status: 400 }
      )
    }

    // Find worker
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return NextResponse.json(
        { success: false, message: 'Worker not found' },
        { status: 404 }
      )
    }

    // Check if worker department matches complaint department
    if (worker.department !== complaint.department) {
      return NextResponse.json(
        { success: false, message: 'Worker department does not match complaint department' },
        { status: 400 }
      )
    }

    // Assign complaint
    complaint.assignedTo = worker._id as unknown as typeof complaint.assignedTo
    complaint.officeId = new Types.ObjectId(user.id)
    complaint.status = 'assigned'
    await complaint.save()

    // Add to worker's assigned tasks
    worker.assignedTasks.push(complaint._id as unknown as typeof worker.assignedTasks[0])
    await worker.save()

    return NextResponse.json({
      success: true,
      message: 'Complaint assigned successfully',
      data: {
        complaintId: complaint._id,
        workerId: worker._id,
        status: complaint.status,
      },
    })
  } catch (error) {
    console.error('Assign complaint error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to assign complaint' },
      { status: 500 }
    )
  }
}

export const POST = requireRole(['office', 'admin', 'superadmin'], handler)
