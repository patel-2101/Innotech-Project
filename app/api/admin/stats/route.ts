import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Citizen from '@/models/Citizen'
import Complaint from '@/models/Complaint'
import Worker from '@/models/Worker'
import Office from '@/models/Office'
import Admin from '@/models/Admin'
import { requireAdmin } from '@/lib/middleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(_request: Request, _user: { id: string; role: string }) {
  try {
    await dbConnect()

    // Get counts
    const [
      totalCitizens,
      totalWorkers,
      totalOffices,
      totalAdmins,
      totalComplaints,
      pendingComplaints,
      assignedComplaints,
      inProgressComplaints,
      completedComplaints,
      rejectedComplaints,
    ] = await Promise.all([
      Citizen.countDocuments(),
      Worker.countDocuments(),
      Office.countDocuments(),
      Admin.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'assigned' }),
      Complaint.countDocuments({ status: 'in-progress' }),
      Complaint.countDocuments({ status: 'completed' }),
      Complaint.countDocuments({ status: 'rejected' }),
    ])

    // Get complaints by department
    const complaintsByDepartment = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('citizenId', 'name email')
      .select('title status department createdAt')

    // Get average rating
    const ratingStats = await Complaint.aggregate([
      {
        $match: { rating: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCitizens,
          totalWorkers,
          totalOffices,
          totalAdmins,
          totalComplaints,
        },
        complaintStatus: {
          pending: pendingComplaints,
          assigned: assignedComplaints,
          inProgress: inProgressComplaints,
          completed: completedComplaints,
          rejected: rejectedComplaints,
        },
        complaintsByDepartment,
        recentComplaints,
        ratings: ratingStats[0] || { avgRating: 0, totalRatings: 0 },
      },
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

export const GET = requireAdmin(handler)
