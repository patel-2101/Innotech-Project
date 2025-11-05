import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Worker from '@/models/Worker'
import { requireRole } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    const { pathname } = new URL(request.url)
    const pathParts = pathname.split('/').filter(part => part) // Remove empty strings
    const workerId = pathParts[2] // ['api', 'workers', '[id]', 'delete']

    if (!workerId || workerId === 'delete') {
      return NextResponse.json(
        { success: false, message: 'Worker ID is required' },
        { status: 400 }
      )
    }

    // Find and delete worker
    const worker = await Worker.findByIdAndDelete(workerId)

    if (!worker) {
      return NextResponse.json(
        { success: false, message: 'Worker not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Worker deleted successfully',
    })
  } catch (error) {
    console.error('Delete worker error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete worker' },
      { status: 500 }
    )
  }
}

export const DELETE = requireRole(['admin', 'superadmin'], handler)
