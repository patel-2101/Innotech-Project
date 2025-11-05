'use client'

import Link from 'next/link'
import { AlertCircle, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react'

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
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-300">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Left Section - App Details */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Smart Complaint</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              A comprehensive complaint management system designed to streamline
              citizen grievances and ensure quick resolution through efficient
              tracking and real-time monitoring.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">patelravi2253@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+91 9161311670</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-600 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">KIET Group of Institutions, Ghaziabad</span>
              </div>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded"></span>
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-400 hover:text-blue-400 hover:pl-2 transition-all text-sm"
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Social Media */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded"></span>
              Connect With Us
            </h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Follow us on social media for updates, announcements, and community news
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`p-3 bg-gray-800 rounded-xl ${social.color} transition-all transform hover:scale-110 hover:shadow-lg`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              © {new Date().getFullYear()} Smart Complaint Management System. Made with 
              <Heart className="w-4 h-4 text-red-500 fill-current inline animate-pulse" /> 
              by Team Innotech
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  )
}
