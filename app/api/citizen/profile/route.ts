import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { getAuthUser } from '@/lib/middleware'

// GET /api/citizen/profile - Get citizen profile
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get authenticated user
    const user = await getAuthUser(req)
    if (!user || user.role !== 'citizen') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch citizen details
    const citizen = await Citizen.findById(user.id).select('-password -otp -otpExpiry')

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Citizen not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: citizen._id,
        name: citizen.name,
        phone: citizen.phone,
        email: citizen.email,
        address: citizen.address,
        profilePhoto: citizen.profilePhoto,
        verified: citizen.verified,
        createdAt: citizen.createdAt,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
