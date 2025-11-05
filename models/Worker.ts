import mongoose, { Schema, Model, models } from 'mongoose'

export interface IWorker {
  _id: string
  name: string
  userId: string
  password: string
  department: string
  assignedTasks: mongoose.Types.ObjectId[]
  location?: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  otp?: string
  otpExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

const WorkerSchema = new Schema<IWorker>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['road', 'water', 'sewage', 'electricity', 'garbage', 'other'],
    },
    assignedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Complaint',
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create geospatial index for location-based queries
WorkerSchema.index({ location: '2dsphere' })

const Worker: Model<IWorker> = models.Worker || mongoose.model<IWorker>('Worker', WorkerSchema)

export default Worker
