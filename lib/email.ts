import nodemailer from 'nodemailer'

// Email configuration (using Gmail as example)
// In production, use environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
})

export async function sendOTPEmail(email: string, otp: string, name: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Smart Complaint System <noreply@smartcomplaint.com>',
      to: email,
      subject: 'Your OTP for Smart Complaint System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Smart Complaint Management System</h2>
          <p>Hello ${name},</p>
          <p>Your OTP for verification is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<boolean> {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Smart Complaint System <noreply@smartcomplaint.com>',
      to: email,
      subject: 'Password Reset Request - Smart Complaint System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Smart Complaint Management System</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

// SMS sending function (placeholder - integrate with Twilio, AWS SNS, etc.)
export async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`SMS OTP sent to ${phone}: ${otp}`)
    
    // For now, just log it (in production, use actual SMS service)
    // Example with Twilio:
    // const client = twilio(accountSid, authToken)
    // await client.messages.create({
    //   body: `Your Smart Complaint System OTP is: ${otp}. Valid for 10 minutes.`,
    //   from: twilioPhoneNumber,
    //   to: phone
    // })
    
    return true
  } catch (error) {
    console.error('SMS sending error:', error)
    return false
  }
}
