import mongoose, { Schema, Model, models } from 'mongoose'

export interface IAdmin {
  _id: string
  name: string
  userId: string
  password: string
  role: 'superadmin' | 'admin'
  email?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
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
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Admin: Model<IAdmin> = models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
