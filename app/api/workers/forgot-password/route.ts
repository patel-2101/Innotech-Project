import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
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

    // Find worker by userId
    const worker = await Worker.findOne({ userId })

    if (!worker) {
      return NextResponse.json(
        { success: false, message: 'Worker not found' },
        { status: 404 }
      )
    }

    // Check if the selected method is available
    if (method === 'email' && !worker.email) {
      return NextResponse.json(
        { success: false, message: 'Email not registered for this worker' },
        { status: 400 }
      )
    }

    if (method === 'phone' && !worker.phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number not registered for this worker' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    // Save OTP to worker document
    worker.otp = otp
    worker.otpExpiry = otpExpiry
    await worker.save()

    // Send OTP based on method
    if (method === 'email') {
      await sendOTPEmail(worker.email, otp, worker.name)
    } else {
      await sendOTPSMS(worker.phone, otp)
    }

    // Mask contact info for response
    const maskedContact = method === 'email' 
      ? worker.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : worker.phone.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3')

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
