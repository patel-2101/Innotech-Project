import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'
import { validateRequest, officeSchema } from '@/lib/validation'
import { hashPassword } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateRequest(officeSchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { name, userId, password, department, location, phone, email } = validation.value

    // Check if userId already exists
    const existingOffice = await Office.findOne({ userId })
    if (existingOffice) {
      return NextResponse.json(
        { success: false, message: 'Office ID already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create office
    const office = new Office({
      name,
      userId,
      password: hashedPassword,
      department,
      location: location || '',
      phone: phone || '',
      email: email || '',
      workers: [],
      complaints: [],
    })

    await office.save()

    return NextResponse.json({
      success: true,
      message: 'Office created successfully',
      data: {
        officeId: office._id,
        userId: office.userId,
        department: office.department,
      },
    })
  } catch (error) {
    console.error('Create office error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create office' },
      { status: 500 }
    )
  }
}

export const POST = requireRole(['admin', 'superadmin'], handler)
