import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
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

    // Find office by userId
    const office = await Office.findOne({ userId })

    if (!office) {
      return NextResponse.json(
        { success: false, message: 'Office not found' },
        { status: 404 }
      )
    }

    // Verify OTP
    if (office.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 401 }
      )
    }

    if (!office.otpExpiry || !isOTPValid(office.otpExpiry)) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password and clear OTP
    office.password = hashedPassword
    office.otp = ''
    office.otpExpiry = new Date()
    await office.save()

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
