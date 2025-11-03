import mongoose, { Schema, Model, models } from 'mongoose'

export interface IOffice {
  _id: string
  name: string
  userId: string
  password: string
  department: string
  workers: mongoose.Types.ObjectId[]
  complaints: mongoose.Types.ObjectId[]
  location?: string
  phone?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

const OfficeSchema = new Schema<IOffice>(
  {
    name: {
      type: String,
      required: [true, 'Office name is required'],
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
    workers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Worker',
      },
    ],
    complaints: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Complaint',
      },
    ],
    location: {
      type: String,
      trim: true,
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
  },
  {
    timestamps: true,
  }
)

const Office: Model<IOffice> = models.Office || mongoose.model<IOffice>('Office', OfficeSchema)

export default Office
