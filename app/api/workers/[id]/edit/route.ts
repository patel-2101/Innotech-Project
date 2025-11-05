import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'
import { hashPassword } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const workerId = pathname.split('/')[4] // /api/workers/[id]/edit

    if (!workerId) {
      return NextResponse.json(
        { success: false, message: 'Worker ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, department, status, phone, email, password } = body

    // Find worker
    const worker = await Worker.findById(workerId)

    if (!worker) {
      return NextResponse.json(
        { success: false, message: 'Worker not found' },
        { status: 404 }
      )
    }

    // Update fields
    if (name) worker.name = name
    if (department) worker.department = department
    if (status) worker.status = status
    if (phone) worker.phone = phone
    if (email) worker.email = email
    if (password) {
      worker.password = await hashPassword(password)
      worker.plainPassword = password // Update plain password for admin viewing
    }

    await worker.save()

    return NextResponse.json({
      success: true,
      message: 'Worker updated successfully',
      data: {
        workerId: worker._id,
        userId: worker.userId,
        name: worker.name,
        department: worker.department,
        status: worker.status,
      },
    })
  } catch (error) {
    console.error('Update worker error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update worker' },
      { status: 500 }
    )
  }
}

export const PUT = requireRole(['admin', 'superadmin', 'office'], handler)
