import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { generateOTP, getOTPExpiry } from '@/lib/auth'

// POST /api/citizen/send-otp - Send OTP to phone number
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { phone } = await req.json()

    // Validation
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number. Must be 10 digits.' },
        { status: 400 }
      )
    }

    // Check if citizen exists
    const citizen = await Citizen.findOne({ phone })

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Phone number not registered. Please sign up first.' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    // Save OTP to database
    citizen.otp = otp
    citizen.otpExpiry = otpExpiry
    await citizen.save()

    // TODO: Send OTP via SMS service (Twilio, etc.)
    // For now, log to console for testing
    console.log(`📱 OTP for ${phone}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully!',
      data: {
        phone,
        // In development, return OTP for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      },
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
