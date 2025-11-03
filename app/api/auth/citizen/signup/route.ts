import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { validateRequest, citizenSignupSchema } from '@/lib/validation'
import { hashPassword, generateOTP, getOTPExpiry } from '@/lib/auth'
import { sendOTPEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = validateRequest(citizenSignupSchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, password, address } = validation.value

    // Check if email or phone already exists
    const existingCitizen = await Citizen.findOne({
      $or: [{ email }, { phone }],
    })

    if (existingCitizen) {
      return NextResponse.json(
        {
          success: false,
          message: existingCitizen.email === email 
            ? 'Email already registered' 
            : 'Phone number already registered',
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    // Create citizen
    const citizen = new Citizen({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,
      address: address || '',
    })

    await citizen.save()

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, name)

    if (!emailSent) {
      console.error('Failed to send OTP email')
      // Don't fail the signup, user can resend OTP
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email with OTP.',
      data: {
        citizenId: citizen._id,
        email: citizen.email,
        phone: citizen.phone,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
