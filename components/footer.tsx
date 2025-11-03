import Link from 'next/link'
import { AlertCircle, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/process', label: 'Process' },
    { href: '/auth/citizen', label: 'Citizen Login' },
    { href: '/auth/worker', label: 'Worker Login' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - App Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Smart Complaint</span>
            </div>
            <p className="text-gray-400 mb-4">
              A comprehensive complaint management system designed to streamline
              citizen grievances and ensure quick resolution through efficient
              tracking and management.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@smartcomplaint.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 City Hall, Government District</span>
              </div>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Follow us on social media for updates and announcements
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Smart Complaint Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
