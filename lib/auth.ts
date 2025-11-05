import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const JWT_EXPIRES_IN = '7d'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Password comparison
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: { id: string; role: string; userId?: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// Verify JWT token
export function verifyToken(token: string): { id: string; role: string; userId?: string; iat?: number; exp?: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; userId?: string; iat?: number; exp?: number }
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Generate OTP (6 digits)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Get OTP expiry time (10 minutes from now)
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000)
}

// Validate OTP
export function isOTPValid(otpExpiry: Date): boolean {
  return new Date() < otpExpiry
}
