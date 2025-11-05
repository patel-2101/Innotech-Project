import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import Complaint from '@/models/Complaint'
import { requireAdmin } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const search = searchParams.get('search')

    // Build query
    const query: Record<string, unknown> = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    // Fetch citizens with pagination
    const citizens = await Citizen.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Get complaint statistics for each citizen
    const citizensWithStats = await Promise.all(
      citizens.map(async (citizen) => {
        const complaints = await Complaint.find({ citizenId: citizen._id }).lean()
        
        const totalComplaints = complaints.length
        const solvedComplaints = complaints.filter(c => c.status === 'completed').length
        const rejectedComplaints = complaints.filter(c => c.status === 'rejected').length
        const pendingComplaints = complaints.filter(c => 
          c.status === 'pending' || c.status === 'assigned' || c.status === 'in-progress'
        ).length
        
        // Calculate average rating from completed complaints with ratings
        const ratedComplaints = complaints.filter(c => c.rating && c.rating > 0)
        const averageRating = ratedComplaints.length > 0
          ? (ratedComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedComplaints.length).toFixed(1)
          : '0'

        return {
          ...citizen,
          statistics: {
            totalComplaints,
            solvedComplaints,
            rejectedComplaints,
            pendingComplaints,
            averageRating: parseFloat(averageRating),
            ratedComplaintsCount: ratedComplaints.length
          }
        }
      })
    )

    const total = await Citizen.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: citizensWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get citizens error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch citizens' },
      { status: 500 }
    )
  }
}

export const GET = requireAdmin(handler)
