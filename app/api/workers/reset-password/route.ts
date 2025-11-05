import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { hashPassword, isOTPValid } from '@/lib/auth'
import Joi from 'joi'

// Validation schema
const resetPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
})

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { error, value } = resetPasswordSchema.validate(body)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      )
    }

    const { userId, otp, newPassword } = value

    // Find worker by userId
    const worker = await Worker.findOne({ userId })

    if (!worker) {
      return NextResponse.json(
        { success: false, message: 'Worker not found' },
        { status: 404 }
      )
    }

    // Verify OTP
    if (worker.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 401 }
      )
    }

    if (!worker.otpExpiry || !isOTPValid(worker.otpExpiry)) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password and clear OTP
    worker.password = hashedPassword
    worker.otp = ''
    worker.otpExpiry = new Date()
    await worker.save()

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
