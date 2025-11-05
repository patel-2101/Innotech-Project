import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireCitizen } from '@/lib/middleware'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const department = searchParams.get('department')

    // Build query
    const query: Record<string, unknown> = { citizenId: user.id }
    if (status) query.status = status
    if (department) query.department = department

    // Fetch complaints with complete details
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'userId name department phone email')
      .populate('officeId', 'userId name department phone email')
      .lean()

    return NextResponse.json({
      success: true,
      data: complaints,
      count: complaints.length,
    })
  } catch (error) {
    console.error('Fetch complaints error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export const GET = requireCitizen(handler)
