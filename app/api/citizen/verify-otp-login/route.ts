import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { generateToken, isOTPValid } from '@/lib/auth'
import { cookies } from 'next/headers'

// POST /api/citizen/verify-otp-login - Verify OTP and login
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { phone, otp } = await req.json()

    // Validation
    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Find citizen
    const citizen = await Citizen.findOne({ phone })

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Phone number not registered' },
        { status: 404 }
      )
    }

    // Verify OTP
    if (!citizen.otp || !citizen.otpExpiry) {
      return NextResponse.json(
        { success: false, message: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    if (citizen.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (!isOTPValid(citizen.otpExpiry)) {
      return NextResponse.json(
        { success: false, message: 'OTP expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Clear OTP
    citizen.otp = undefined
    citizen.otpExpiry = undefined
    citizen.verified = true
    await citizen.save()

    // Generate JWT token
    const token = generateToken({
      id: citizen._id.toString(),
      role: 'citizen',
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        citizen: {
          id: citizen._id,
          name: citizen.name,
          phone: citizen.phone,
          email: citizen.email,
          profilePhoto: citizen.profilePhoto,
        },
      },
    })
  } catch (error) {
    console.error('Verify OTP login error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
