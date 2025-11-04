import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
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
      .populate('citizenId', 'name phone email')
      .populate('assignedTo', 'userId name')
      .populate('officeId', 'userId department')

    if (!complaint) {
      return NextResponse.json(
        { success: false, message: 'Complaint not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: complaint,
    })
  } catch (error) {
    console.error('Get complaint error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch complaint' },
      { status: 500 }
    )
  }
}

export const GET = requireRole(['citizen', 'worker', 'office', 'admin', 'superadmin'], handler)
