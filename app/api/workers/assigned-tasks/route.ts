import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireWorker } from '@/lib/middleware'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build query
    const query: Record<string, unknown> = { assignedTo: user.id }
    if (status) query.status = status

    // Fetch assigned complaints
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('citizenId', 'name phone email')
      .populate('officeId', 'userId department')

    return NextResponse.json({
      success: true,
      data: complaints,
      count: complaints.length,
    })
  } catch (error) {
    console.error('Fetch assigned tasks error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assigned tasks' },
      { status: 500 }
    )
  }
}

export const GET = requireWorker(handler)
