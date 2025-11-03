import mongoose, { Schema, Model, models } from 'mongoose'

export interface IComplaint {
  _id: string
  citizenId: mongoose.Types.ObjectId
  department: string
  title: string
  description: string
  category: string
  media: {
    type: 'image' | 'video'
    url: string
    publicId: string
  }[]
  location: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
    address?: string
  }
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected'
  assignedTo?: mongoose.Types.ObjectId
  officeId?: mongoose.Types.ObjectId
  priority?: 'low' | 'medium' | 'high'
  progressPhotos: {
    stage: 'start' | 'in-progress' | 'completed'
    url: string
    publicId: string
    uploadedAt: Date
    location?: {
      type: string
      coordinates: [number, number]
    }
  }[]
  rating?: number
  feedback?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: 'Citizen',
      required: [true, 'Citizen ID is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['road', 'water', 'sewage', 'electricity', 'garbage', 'other'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Location coordinates are required'],
      },
      address: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'rejected'],
      default: 'pending',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Worker',
    },
    officeId: {
      type: Schema.Types.ObjectId,
      ref: 'Office',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    progressPhotos: [
      {
        stage: {
          type: String,
          enum: ['start', 'in-progress', 'completed'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
          },
          coordinates: {
            type: [Number],
          },
        },
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create geospatial index for location-based queries
ComplaintSchema.index({ 'location': '2dsphere' })
ComplaintSchema.index({ citizenId: 1, createdAt: -1 })
ComplaintSchema.index({ assignedTo: 1, status: 1 })
ComplaintSchema.index({ officeId: 1, status: 1 })
ComplaintSchema.index({ department: 1, status: 1 })

const Complaint: Model<IComplaint> = models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema)

export default Complaint
