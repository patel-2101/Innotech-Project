import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Complaint from '@/models/Complaint'
import { requireCitizen } from '@/lib/middleware'
import { validateRequest, ratingSchema } from '@/lib/validation'

async function handler(request: Request, user: { id: string; role: string }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { complaintId, rating, feedback } = body

    if (!complaintId) {
      return NextResponse.json(
        { success: false, message: 'Complaint ID is required' },
        { status: 400 }
      )
    }

    // Validate rating
    const validation = validateRequest(ratingSchema, { rating, feedback })
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }

    // Find complaint
    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return NextResponse.json(
        { success: false, message: 'Complaint not found' },
        { status: 404 }
      )
    }

    // Check if citizen owns this complaint
    if (complaint.citizenId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You can only rate your own complaints' },
        { status: 403 }
      )
    }

    // Check if complaint is completed
    if (complaint.status !== 'completed') {
      return NextResponse.json(
        { success: false, message: 'You can only rate completed complaints' },
        { status: 400 }
      )
    }

    // Check if already rated
    if (complaint.rating) {
      return NextResponse.json(
        { success: false, message: 'Complaint already rated' },
        { status: 400 }
      )
    }

    // Add rating
    complaint.rating = rating
    complaint.feedback = feedback || ''
    await complaint.save()

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        complaintId: complaint._id,
        rating: complaint.rating,
      },
    })
  } catch (error) {
    console.error('Rate complaint error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit rating' },
      { status: 500 }
    )
  }
}

export const POST = requireCitizen(handler)
