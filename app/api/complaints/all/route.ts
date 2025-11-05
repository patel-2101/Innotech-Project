import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import Office from '@/models/Office'
import Worker from '@/models/Worker'
import Citizen from '@/models/Citizen'
import { requireRole } from '@/lib/middleware'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()
    
    // Ensure models are registered by importing them
    // This fixes Mongoose schema registration issues in Next.js
    const _citizen = Citizen
    const _worker = Worker
    const _office = Office

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
      const office = await Office.findById(user.id)
      if (office) {
        query.department = office.department
      } else {
        return NextResponse.json(
          { success: false, message: 'Office not found' },
          { status: 404 }
        )
      }
    }

    // Worker can only see their assigned complaints
    if (user.role === 'worker') {
      query.assignedTo = user.id
    }

    // Apply filters
    if (status) query.status = status
    if (department && user.role === 'admin') query.department = department

    // Fetch complaints with pagination
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('citizenId', 'name phone email')
      .populate('assignedTo', 'userId name department employeeId')
      .populate('officeId', 'userId name department')
      .lean()

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
