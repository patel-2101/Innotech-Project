import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireRole } from '@/lib/middleware'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await connectDB()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query based on role
    const query: Record<string, unknown> = {}

    // Office can only see their department's complaints
    if (user.role === 'office') {
      // TODO: Fetch office department from database
      query.department = department || ''
    }

    // Worker can only see their assigned complaints
    if (user.role === 'worker') {
      query.assignedTo = user.id
    }

    // Apply filters
    if (status) query.status = status
    if (department && user.role !== 'office') query.department = department

    // Fetch complaints with pagination
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('citizenId', 'name phone email')
      .populate('assignedTo', 'userId')
      .populate('officeId', 'userId department')

    const total = await Complaint.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fetch all complaints error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export const GET = requireRole(['admin', 'superadmin', 'office', 'worker'], handler)
