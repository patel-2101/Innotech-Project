import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')

    // Build query
    const query: Record<string, unknown> = {}
    if (department) query.department = department

    // Fetch offices
    const offices = await Office.find(query)
      .sort({ createdAt: -1 })
      .select('-password')
      .populate('workers', 'userId name department')
      .populate('complaints', 'title status')

    return NextResponse.json({
      success: true,
      data: offices,
      count: offices.length,
    })
  } catch (error) {
    console.error('Get offices error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offices' },
      { status: 500 }
    )
  }
}

export const GET = requireRole(['admin', 'superadmin'], handler)
