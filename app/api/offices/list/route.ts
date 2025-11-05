import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const showPassword = searchParams.get('showPassword') === 'true'

    // Build query
    const query: Record<string, unknown> = {}
    if (department) query.department = department

    // Fetch offices - include plainPassword field for admin
    const offices = await Office.find(query)
      .sort({ createdAt: -1 })
      .select('-password') // Exclude hashed password
      .select('+plainPassword') // Include plain password (field with select: false)
      .populate('workers', 'userId name department')
      .populate('complaints', 'title status')
      .lean()

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
