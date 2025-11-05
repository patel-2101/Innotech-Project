import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { generateOTP, getOTPExpiry } from '@/lib/auth'
import { sendOTPEmail, sendOTPSMS } from '@/lib/email'
import Joi from 'joi'

// Validation schema
const forgotPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  method: Joi.string().valid('email', 'phone').required(),
})

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { error, value } = forgotPasswordSchema.validate(body)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      )
    }

    const { userId, method } = value

    // Find office by userId
    const office = await Office.findOne({ userId })

    if (!office) {
      return NextResponse.json(
        { success: false, message: 'Office not found' },
        { status: 404 }
      )
    }

    // Check if the selected method is available
    if (method === 'email' && !office.email) {
      return NextResponse.json(
        { success: false, message: 'Email not registered for this office' },
        { status: 400 }
      )
    }

    if (method === 'phone' && !office.phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number not registered for this office' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    // Save OTP to office document
    office.otp = otp
    office.otpExpiry = otpExpiry
    await office.save()

    // Send OTP based on method
    if (method === 'email') {
      if (!office.email) {
        return NextResponse.json(
          { success: false, message: 'Email not available' },
          { status: 400 }
        )
      }
      await sendOTPEmail(office.email, otp, office.name)
    } else {
      if (!office.phone) {
        return NextResponse.json(
          { success: false, message: 'Phone not available' },
          { status: 400 }
        )
      }
      await sendOTPSMS(office.phone, otp)
    }

    // Mask contact info for response
    const maskedContact = method === 'email' 
      ? office.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3') || ''
      : office.phone?.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3') || ''

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${method}`,
      data: {
        method,
        contact: maskedContact,
      },
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
