import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')

    // Build query
    const query: Record<string, unknown> = {}
    if (department) query.department = department
    if (status) query.status = status

    // Fetch workers
    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .select('-password -otp -otpExpiry')
      .lean()

    return NextResponse.json({
      success: true,
      data: workers,
      count: workers.length,
    })
  } catch (error) {
    console.error('Get workers error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workers' },
      { status: 500 }
    )
  }
}

export const GET = requireRole(['office', 'admin', 'superadmin'], handler)
