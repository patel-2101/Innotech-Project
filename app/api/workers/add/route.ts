import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'
import { hashPassword } from '@/lib/auth'
import { sendOTPSMS } from '@/lib/email'
import Joi from 'joi'

// Worker creation schema with only required fields
const createWorkerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  department: Joi.string()
    .valid('road', 'water', 'sewage', 'electricity', 'garbage', 'other')
    .required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits',
  }),
  email: Joi.string().email().required(),
})

// Function to generate unique worker ID
function generateWorkerId(department: string): string {
  const prefix = 'WRK_' + department.substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `${prefix}_${timestamp}${random}`
}

// Function to generate random password
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { error, value } = createWorkerSchema.validate(body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    const { name, department, phone, email } = value

    // Check if phone or email already exists
    const existingWorker = await Worker.findOne({
      $or: [{ phone }, { email }]
    })
    
    if (existingWorker) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingWorker.phone === phone 
            ? 'Phone number already registered' 
            : 'Email already registered' 
        },
        { status: 409 }
      )
    }

    // Auto-generate userId and password
    const userId = generateWorkerId(department)
    const password = generatePassword()
    const hashedPassword = await hashPassword(password)

    // Create worker
    const worker = new Worker({
      name,
      userId,
      password: hashedPassword,
      plainPassword: password, // Store plain password for admin viewing
      department,
      phone,
      email,
      status: 'active',
      assignedTasks: [],
    })

    await worker.save()

    // Send SMS with login credentials
    try {
      await sendOTPSMS(
        phone,
        `Welcome to Smart Complaint System!\nYour Worker Login ID: ${userId}\nPassword: ${password}\nLogin at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/worker`
      )
    } catch (smsError) {
      console.error('SMS sending failed:', smsError)
      // Don't fail the request if SMS fails
    }

    return NextResponse.json({
      success: true,
      message: 'Worker created successfully. Login credentials sent via SMS.',
      data: {
        workerId: worker._id,
        userId: worker.userId,
        department: worker.department,
        phone: worker.phone,
        email: worker.email,
        // Include password in response for admin to see
        generatedPassword: password,
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
