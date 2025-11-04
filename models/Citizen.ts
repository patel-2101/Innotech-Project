import mongoose, { Schema, Model, models } from 'mongoose'

export interface ICitizen {
  _id: string
  name: string
  phone: string
  email: string
  password: string
  address?: string
  profilePhoto?: string
  otp?: string
  otpExpiry?: Date
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const CitizenSchema = new Schema<ICitizen>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    address: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Citizen: Model<ICitizen> = models.Citizen || mongoose.model<ICitizen>('Citizen', CitizenSchema)

export default Citizen
