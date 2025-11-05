import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'
import { hashPassword } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const officeId = pathname.split('/')[4] // /api/offices/[id]/edit

    if (!officeId) {
      return NextResponse.json(
        { success: false, message: 'Office ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, department, location, phone, email, password } = body

    // Find office
    const office = await Office.findById(officeId)

    if (!office) {
      return NextResponse.json(
        { success: false, message: 'Office not found' },
        { status: 404 }
      )
    }

    // Update fields
    if (name) office.name = name
    if (department) office.department = department
    if (location) office.location = location
    if (phone) office.phone = phone
    if (email) office.email = email
    if (password) {
      office.password = await hashPassword(password)
      office.plainPassword = password // Update plain password for admin viewing
    }

    await office.save()

    return NextResponse.json({
      success: true,
      message: 'Office updated successfully',
      data: {
        officeId: office._id,
        userId: office.userId,
        department: office.department,
      },
    })
  } catch (error) {
    console.error('Update office error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update office' },
      { status: 500 }
    )
  }
}

export const PUT = requireRole(['admin', 'superadmin'], handler)
