/**
 * Client-side authentication utilities
 * Handles token storage, retrieval, and user session management
 */

export interface AuthUser {
  id: string
  role: 'citizen' | 'worker' | 'office' | 'admin' | 'superadmin'
  userId?: string
  name?: string
  email?: string
}

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

/**
 * Save authentication token to localStorage
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

/**
 * Save user data to localStorage
 */
export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * Get user data from localStorage
 */
export function getAuthUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr) as AuthUser
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Remove user data from localStorage
 */
export function removeAuthUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY)
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Logout user (clear all auth data)
 */
export function logout(): void {
  removeAuthToken()
  removeAuthUser()
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): { Authorization: string } | Record<string, never> {
  const token = getAuthToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}
