import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface AuthUser {
  id: string
  role: string
  userId?: string
  iat?: number
  exp?: number
}

// Verify JWT token from request headers
export function getAuthUser(request: Request): AuthUser | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No authorization header or invalid format')
    return null
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  const decoded = verifyToken(token)

  if (!decoded) {
    console.log('Token verification failed')
    return null
  }

  console.log('Decoded user:', { id: decoded.id, role: decoded.role, userId: decoded.userId })
  return decoded
}

// Middleware to check if user is authenticated
export function requireAuth(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return async (request: Request) => {
    const user = getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

// Middleware to check specific roles
export function requireRole(
  allowedRoles: string[],
  handler: (request: Request, user: AuthUser) => Promise<NextResponse>
) {
  return async (request: Request) => {
    const user = getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      )
    }

    return handler(request, user)
  }
}

// Check if user is citizen
export function requireCitizen(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return requireRole(['citizen'], handler)
}

// Check if user is worker
export function requireWorker(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return requireRole(['worker'], handler)
}

// Check if user is office
export function requireOffice(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return requireRole(['office'], handler)
}

// Check if user is admin or superadmin
export function requireAdmin(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return requireRole(['admin', 'superadmin'], handler)
}

// Check if user is superadmin only
export function requireSuperAdmin(handler: (request: Request, user: AuthUser) => Promise<NextResponse>) {
  return requireRole(['superadmin'], handler)
}
