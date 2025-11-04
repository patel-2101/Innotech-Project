import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { validateRequest, citizenSigninSchema } from '@/lib/validation'
import { comparePassword, generateToken, isOTPValid } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateRequest(citizenSigninSchema, body)

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    const { email, phone, password, otp } = validation.value

    // Find citizen by email or phone
    const citizen = await Citizen.findOne({
      $or: [{ email }, { phone }],
    })

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if verified
    if (!citizen.verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please verify your email first',
          requireVerification: true,
        },
        { status: 403 }
      )
    }

    // Password-based login
    if (password) {
      const isPasswordValid = await comparePassword(password, citizen.password)
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }
    // OTP-based login
    else if (otp) {
      if (citizen.otp !== otp) {
        return NextResponse.json(
          { success: false, message: 'Invalid OTP' },
          { status: 401 }
        )
      }

      if (!citizen.otpExpiry || !isOTPValid(citizen.otpExpiry)) {
        return NextResponse.json(
          { success: false, message: 'OTP has expired' },
          { status: 401 }
        )
      }

      // Clear OTP after successful login
      citizen.otp = ''
      citizen.otpExpiry = new Date()
      await citizen.save()
    } else {
      return NextResponse.json(
        { success: false, message: 'Password or OTP is required' },
        { status: 400 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: citizen._id.toString(),
      role: 'citizen',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
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
    console.error('Signin error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
