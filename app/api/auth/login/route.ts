import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Worker from '@/models/Worker'
import Office from '@/models/Office'
import Admin from '@/models/Admin'
import { validateRequest, userLoginSchema } from '@/lib/validation'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = validateRequest(userLoginSchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { userId, password } = validation.value

    // Try to find user in Worker, Office, or Admin collections
    let user = null
    let role = ''

    // Check Worker
    const worker = await Worker.findOne({ userId })
    if (worker) {
      user = worker
      role = 'worker'
    }

    // Check Office
    if (!user) {
      const office = await Office.findOne({ userId })
      if (office) {
        user = office
        role = 'office'
      }
    }

    // Check Admin
    if (!user) {
      const admin = await Admin.findOne({ userId })
      if (admin) {
        user = admin
        role = admin.role // 'admin' or 'superadmin'
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      role: role,
      userId: user.userId,
    })

    // Prepare user data (without password)
    const userData: Record<string, unknown> = {
      id: user._id,
      userId: user.userId,
      role: role,
    }

    // Add role-specific data
    if (role === 'worker' && worker) {
      userData.department = worker.department
      userData.status = worker.status
    } else if (role === 'office') {
      const office = await Office.findOne({ userId: user.userId })
      if (office) {
        userData.department = office.department
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
