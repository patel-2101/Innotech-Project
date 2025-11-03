import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'
import { validateRequest, workerSchema } from '@/lib/validation'
import { hashPassword } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = validateRequest(workerSchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { name, userId, password, department, phone, email } = validation.value

    // Check if userId already exists
    const existingWorker = await Worker.findOne({ userId })
    if (existingWorker) {
      return NextResponse.json(
        { success: false, message: 'Worker ID already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create worker
    const worker = new Worker({
      name,
      userId,
      password: hashedPassword,
      department,
      phone: phone || '',
      email: email || '',
      status: 'active',
      assignedTasks: [],
    })

    await worker.save()

    return NextResponse.json({
      success: true,
      message: 'Worker created successfully',
      data: {
        workerId: worker._id,
        userId: worker.userId,
        department: worker.department,
      },
    })
  } catch (error) {
    console.error('Create worker error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create worker' },
      { status: 500 }
    )
  }
}

export const POST = requireRole(['admin', 'superadmin', 'office'], handler)
