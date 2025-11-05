import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'
import { hashPassword } from '@/lib/auth'
import { sendOTPSMS } from '@/lib/email'
import Joi from 'joi'

// Office creation schema with only required fields
const createOfficeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  department: Joi.string()
    .valid('road', 'water', 'sewage', 'electricity', 'garbage', 'other')
    .required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits',
  }),
  email: Joi.string().email().required(),
})

// Function to generate unique office ID
function generateOfficeId(department: string): string {
  const prefix = department.substring(0, 3).toUpperCase()
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
    const { error, value } = createOfficeSchema.validate(body, { abortEarly: false })

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
    const existingOffice = await Office.findOne({
      $or: [{ phone }, { email }]
    })
    
    if (existingOffice) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingOffice.phone === phone 
            ? 'Phone number already registered' 
            : 'Email already registered' 
        },
        { status: 409 }
      )
    }

    // Auto-generate userId and password
    const userId = generateOfficeId(department)
    const password = generatePassword()
    const hashedPassword = await hashPassword(password)

    // Create office
    const office = new Office({
      name,
      userId,
      password: hashedPassword,
      plainPassword: password, // Store plain password for admin viewing
      department,
      location: '',
      phone,
      email,
      workers: [],
      complaints: [],
    })

    await office.save()

    // Send SMS with login credentials
    try {
      await sendOTPSMS(
        phone,
        `Welcome to Smart Complaint System!\nYour Login ID: ${userId}\nPassword: ${password}\nLogin at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/office`
      )
    } catch (smsError) {
      console.error('SMS sending failed:', smsError)
      // Don't fail the request if SMS fails
    }

    return NextResponse.json({
      success: true,
      message: 'Office created successfully. Login credentials sent via SMS.',
      data: {
        officeId: office._id,
        userId: office.userId,
        department: office.department,
        phone: office.phone,
        email: office.email,
        // Include password in response for admin to see
        generatedPassword: password,
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
