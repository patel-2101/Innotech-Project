'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, AlertCircle, UserCircle, ChevronDown, LogOut } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const role = localStorage.getItem('userRole')
      const name = localStorage.getItem('userName')
      
      setIsLoggedIn(!!token)
      setUserRole(role || '')
      setUserName(name || '')
    }

    // Check on mount
    checkAuth()

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userDepartment')
    
    setIsLoggedIn(false)
    setUserRole('')
    setUserName('')
    
    // Trigger navbar update
    window.dispatchEvent(new Event('storage'))
    
    router.push('/')
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case 'citizen': return '/citizen/dashboard'
      case 'worker': return '/worker/dashboard'
      case 'office': return '/office/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/process', label: 'Process' },
  ]

  const loginOptions = [
    { href: '/auth/citizen/login', label: 'Citizen Login', color: 'text-blue-600' },
    { href: '/auth/worker', label: 'Worker Login', color: 'text-green-600' },
    { href: '/auth/office', label: 'Office Login', color: 'text-purple-600' },
    { href: '/auth/admin', label: 'Admin Login', color: 'text-red-600' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Smart Complaint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Login/Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>{userName || userRole}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsLoginDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoginDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Login</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {loginOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsLoginDropdownOpen(false)}
                        className={`block px-4 py-2 ${option.color} dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Login/Profile Options */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {userName || userRole}
                    </p>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Login As
                    </p>
                    {loginOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-2 ${option.color} dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
