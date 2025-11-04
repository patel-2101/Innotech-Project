import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import { requireAdmin } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const citizenId = pathname.split('/')[4] // /api/admin/citizens/[id]

    if (!citizenId) {
      return NextResponse.json(
        { success: false, message: 'Citizen ID is required' },
        { status: 400 }
      )
    }

    // Find and deactivate/delete citizen
    const citizen = await Citizen.findByIdAndDelete(citizenId)

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: 'Citizen not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Citizen deleted successfully',
    })
  } catch (error) {
    console.error('Delete citizen error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete citizen' },
      { status: 500 }
    )
  }
}

export const DELETE = requireAdmin(handler)
