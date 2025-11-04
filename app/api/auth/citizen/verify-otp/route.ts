import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { validateRequest, otpVerifySchema } from '@/lib/validation'
import { generateToken, isOTPValid } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateRequest(otpVerifySchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { identifier, otp } = validation.value

    // Find citizen by email or phone
    const citizen = await Citizen.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    })

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Citizen not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (citizen.verified) {
      return NextResponse.json(
        { success: false, message: 'Account already verified' },
        { status: 400 }
      )
    }

    // Validate OTP
    if (citizen.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (!citizen.otpExpiry || !isOTPValid(citizen.otpExpiry)) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Mark as verified and clear OTP
    citizen.verified = true
    citizen.otp = ''
    citizen.otpExpiry = new Date()
    await citizen.save()

    // Generate JWT token
    const token = generateToken({
      id: citizen._id.toString(),
      role: 'citizen',
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        citizen: {
          id: citizen._id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          verified: citizen.verified,
        },
      },
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
