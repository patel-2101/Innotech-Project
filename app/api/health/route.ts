import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import Worker from '@/models/Worker'
import Office from '@/models/Office'
import Admin from '@/models/Admin'
import Complaint from '@/models/Complaint'

/**
 * Health check endpoint to verify MongoDB connection and initialize collections
 * GET /api/health
 */
export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect()

    // Initialize all models (this ensures collections are created)
    const collections = await Promise.all([
      Citizen.createCollection().catch(() => null),
      Worker.createCollection().catch(() => null),
      Office.createCollection().catch(() => null),
      Admin.createCollection().catch(() => null),
      Complaint.createCollection().catch(() => null),
    ])

    // Get collection stats
    const stats = {
      citizens: await Citizen.countDocuments(),
      workers: await Worker.countDocuments(),
      offices: await Office.countDocuments(),
      admins: await Admin.countDocuments(),
      complaints: await Complaint.countDocuments(),
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection healthy',
      database: 'smart_complaint_system',
      collections: {
        created: collections.filter(Boolean).length,
        total: 5,
        names: ['citizens', 'workers', 'offices', 'admins', 'complaints'],
      },
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
