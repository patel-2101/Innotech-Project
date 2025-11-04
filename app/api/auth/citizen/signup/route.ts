import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { validateRequest, citizenSignupSchema } from '@/lib/validation'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()

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

    // Create citizen (no OTP verification needed)
    const citizen = new Citizen({
      name,
      email,
      phone,
      password: hashedPassword,
      verified: true, // Auto-verify since OTP is removed
      address: address || '',
    })

    await citizen.save()

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.',
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
