import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { requireSuperAdmin } from '@/lib/middleware'
import { hashPassword } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { userId, password, role } = body

    if (!userId || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'userId, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['admin', 'superadmin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be admin or superadmin' },
        { status: 400 }
      )
    }

    // Check if userId already exists
    const existingAdmin = await Admin.findOne({ userId })
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin ID already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin
    const admin = new Admin({
      userId,
      password: hashedPassword,
      role,
    })

    await admin.save()

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: {
        adminId: admin._id,
        userId: admin.userId,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create admin' },
      { status: 500 }
    )
  }
}

export const POST = requireSuperAdmin(handler)
