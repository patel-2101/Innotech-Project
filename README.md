<<<<<<< HEAD
# Smart Complaint Management System

A comprehensive web application built with **Next.js** and **Tailwind CSS** for managing civic complaints efficiently. This system provides separate portals for citizens, workers, office administrators, and system administrators.

## 🚀 Features

### General Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Dark/Light mode toggle
- ✅ Clean and modern UI using Tailwind CSS
- ✅ Reusable component library
- ✅ Navbar and Footer on all pages

### User Roles & Authentication

#### 1. **Citizen Portal** (`/auth/citizen`)
- Sign Up with email/phone
- Sign In with Email + Password or Phone + OTP (UI only)
- Forgot Password functionality
- Dashboard with complaint management

#### 2. **Worker Portal** (`/auth/worker`)
- Login with User ID + Password
- Dashboard with assigned complaints and photo upload

#### 3. **Office Portal** (`/auth/office`)
- Login with User ID + Password
- Dashboard with complaint assignment and tracking

#### 4. **Admin Portal** (`/auth/admin`)
- Login with Admin ID + Password
- Dashboard with full system management

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Theme**: next-themes
- **Language**: TypeScript

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Key Routes

### Authentication
- `/auth/citizen` - Citizen portal
- `/auth/worker` - Worker login
- `/auth/office` - Office login
- `/auth/admin` - Admin login

### Dashboards
- `/citizen/dashboard` - Citizen complaint management
- `/worker/dashboard` - Worker task management
- `/office/dashboard` - Office administration
- `/admin/dashboard` - System administration

### Static Pages
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/process` - How it works

## 🎨 Components

Reusable UI components include:
- Button (multiple variants)
- Card components
- Input/Select/Textarea
- Modal
- Theme Toggle

## 🎯 Status Types

- **Pending**: Newly submitted
- **Assigned**: Worker assigned
- **In Progress**: Work underway
- **Completed**: Resolved
- **Rejected**: Invalid

## 📝 Note

This is a **frontend-only** implementation. No backend logic, database, or API integration is included. All data is static/mock data for demonstration purposes.

## 🚦 Future Enhancements

Backend integration needed for:
- Real authentication
- Database storage
- File uploads
- OTP verification
- Real-time notifications
- GPS/Map integration
- Analytics API

---

Built with Next.js and Tailwind CSS
=======
# Innotech-Project
>>>>>>> 45628b4cc817c177950bf577d2d9024c62da8a9a
