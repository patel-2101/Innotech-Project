import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Office from '@/models/Office'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const pathParts = pathname.split('/').filter(part => part) // Remove empty strings
    const officeId = pathParts[2] // ['api', 'offices', '[id]', 'delete']

    if (!officeId || officeId === 'delete') {
      return NextResponse.json(
        { success: false, message: 'Office ID is required' },
        { status: 400 }
      )
    }

    // Find and delete office
    const office = await Office.findByIdAndDelete(officeId)

    if (!office) {
      return NextResponse.json(
        { success: false, message: 'Office not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Office deleted successfully',
    })
  } catch (error) {
    console.error('Delete office error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete office' },
      { status: 500 }
    )
  }
}

export const DELETE = requireRole(['admin', 'superadmin'], handler)
