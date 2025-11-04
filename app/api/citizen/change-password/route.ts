import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { getAuthUser } from '@/lib/middleware'
import { comparePassword, hashPassword } from '@/lib/auth'

// POST /api/citizen/change-password - Change password
export async function POST(req: NextRequest) {
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

    const { oldPassword, newPassword, confirmPassword } = await req.json()

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New passwords do not match' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from old password' },
        { status: 400 }
      )
    }

    // Find citizen
    const citizen = await Citizen.findById(user.id)
    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Citizen not found' },
        { status: 404 }
      )
    }

    // Verify old password
    const isValidPassword = await comparePassword(oldPassword, citizen.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Old password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    citizen.password = hashedPassword
    await citizen.save()

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to change password' },
      { status: 500 }
    )
  }
}
