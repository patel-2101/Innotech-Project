import Joi from 'joi'

// Citizen signup validation
export const citizenSignupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  address: Joi.string().allow('').optional(),
})

// Citizen signin validation
export const citizenSigninSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  password: Joi.string().optional(),
  otp: Joi.string().length(6).optional(),
}).or('email', 'phone')

// OTP verification schema
export const otpVerifySchema = Joi.object({
  identifier: Joi.string().required(), // email or phone
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be 6 digits',
  }),
})

// Worker/Office/Admin login validation
export const userLoginSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
})

// Complaint creation validation
export const complaintSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters',
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters',
  }),
  department: Joi.string()
    .valid('road', 'water', 'sewage', 'electricity', 'garbage', 'other')
    .required(),
  category: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().allow('').optional(),
})

// Password reset validation
export const passwordResetSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
  }),
})

// Rating and feedback validation
export const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  feedback: Joi.string().max(500).allow('').optional(),
})

// Worker creation validation
export const workerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  userId: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  department: Joi.string()
    .valid('road', 'water', 'sewage', 'electricity', 'garbage', 'other')
    .required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  email: Joi.string().email().optional(),
})

// Office creation validation
export const officeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  userId: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  department: Joi.string()
    .valid('road', 'water', 'sewage', 'electricity', 'garbage', 'other')
    .required(),
  location: Joi.string().allow('').optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  email: Joi.string().email().optional(),
})

// Validate request body
export function validateRequest(schema: Joi.ObjectSchema, data: unknown) {
  const { error, value } = schema.validate(data, { abortEarly: false })
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }))
    return { valid: false, errors, value: null }
  }
  
  return { valid: true, errors: null, value }
}
