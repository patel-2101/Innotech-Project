# Smart Complaint Management System - Backend API Documentation

## Overview
This document describes the complete backend API implementation for the Smart Complaint Management System.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT with bcryptjs
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi

## Environment Variables
Create a `.env.local` file with:
```env
MONGODB_URI=mongodb://localhost:27017/smart_complaint_system
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Database Collections

### 1. Citizens
- **Fields**: name, email, phone, password, otp, otpExpiry, verified, address
- **Indexes**: Unique on email and phone

### 2. Workers
- **Fields**: userId, password, department, assignedTasks[], location (Point), status
- **Indexes**: Unique on userId, 2dsphere on location

### 3. Offices
- **Fields**: userId, password, department, workers[], complaints[], location
- **Indexes**: Unique on userId

### 4. Admins
- **Fields**: userId, password, role (admin/superadmin)
- **Indexes**: Unique on userId

### 5. Complaints
- **Fields**: citizenId, title, description, department, category, media[], location (Point), status, assignedTo, officeId, progressPhotos[], rating, feedback
- **Indexes**: 2dsphere on location, compound indexes for queries

## API Endpoints

### Authentication APIs

#### POST `/api/auth/citizen/signup`
Register a new citizen with OTP verification.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "address": "123 Main St" // optional
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with OTP.",
  "data": {
    "citizenId": "...",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

#### POST `/api/auth/citizen/verify-otp`
Verify OTP and activate account.

**Request Body**:
```json
{
  "identifier": "john@example.com", // or phone number
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt-token",
    "citizen": { ... }
  }
}
```

#### POST `/api/auth/citizen/signin`
Citizen login with email/phone and password or OTP.

**Request Body (Password)**:
```json
{
  "email": "john@example.com", // or "phone": "1234567890"
  "password": "password123"
}
```

**Request Body (OTP)**:
```json
{
  "phone": "1234567890",
  "otp": "123456"
}
```

#### POST `/api/auth/login`
Login for Workers, Offices, and Admins.

**Request Body**:
```json
{
  "userId": "WORKER001",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "...",
      "userId": "WORKER001",
      "role": "worker",
      "department": "road"
    }
  }
}
```

### Complaint APIs

#### POST `/api/complaints/create`
Create a new complaint (Citizen only).

**Headers**: `Authorization: Bearer <token>`

**Request** (multipart/form-data):
```
title: Broken Road
description: Large pothole on Main Street
department: road
category: Pothole
latitude: 40.7128
longitude: -74.0060
address: 123 Main St
media: [File, File] // images/videos
```

**Response**:
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "complaintId": "...",
    "status": "pending"
  }
}
```

#### GET `/api/complaints/my-complaints`
Get all complaints for logged-in citizen.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `status`: pending, assigned, in-progress, completed, rejected
- `department`: road, water, sewage, electricity, garbage, other

#### GET `/api/complaints/all`
Get all complaints (Admin, Office, Worker).

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `status`: Filter by status
- `department`: Filter by department
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### POST `/api/complaints/assign`
Assign complaint to worker (Office/Admin only).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "complaintId": "...",
  "workerId": "..."
}
```

#### PUT `/api/complaints/update-status`
Update complaint status (Worker only).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "complaintId": "...",
  "status": "in-progress" // or "completed", "rejected"
}
```

#### POST `/api/complaints/rate`
Rate completed complaint (Citizen only).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "complaintId": "...",
  "rating": 5,
  "feedback": "Great work!" // optional
}
```

### Worker APIs

#### POST `/api/workers/add`
Create a new worker (Admin/Office only).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Worker Name",
  "userId": "WORKER001",
  "password": "password123",
  "department": "road",
  "phone": "1234567890", // optional
  "email": "worker@example.com" // optional
}
```

#### POST `/api/workers/upload-progress`
Upload progress photo with geolocation verification (Worker only).

**Headers**: `Authorization: Bearer <token>`

**Request** (multipart/form-data):
```
complaintId: ...
stage: in-progress (or completed)
latitude: 40.7128
longitude: -74.0060
description: Work started
photo: File
```

**Note**: Worker must be within 10 meters of complaint location.

#### GET `/api/workers/assigned-tasks`
Get all tasks assigned to logged-in worker.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `status`: Filter by status

## Utility Functions

### Authentication (`/lib/auth.ts`)
- `hashPassword(password)`: Hash password with bcrypt
- `comparePassword(password, hash)`: Compare passwords
- `generateToken(payload)`: Generate JWT token
- `verifyToken(token)`: Verify and decode JWT
- `generateOTP()`: Generate 6-digit OTP
- `getOTPExpiry()`: Get OTP expiry (10 minutes)

### Email (`/lib/email.ts`)
- `sendOTPEmail(email, otp, name)`: Send OTP via email
- `sendPasswordResetEmail(email, token, name)`: Send reset link
- `sendOTPSMS(phone, otp)`: Send OTP via SMS (placeholder)

### Cloudinary (`/lib/cloudinary.ts`)
- `uploadToCloudinary(file, folder)`: Upload file
- `uploadMultipleToCloudinary(files, folder)`: Upload multiple
- `deleteFromCloudinary(publicId)`: Delete file
- `deleteMultipleFromCloudinary(publicIds)`: Delete multiple

### Geolocation (`/lib/geolocation.ts`)
- `calculateDistance(lat1, lon1, lat2, lon2)`: Haversine formula
- `isWithinAllowedDistance(...)`: Check if within radius
- `isValidCoordinates(lat, lon)`: Validate coordinates

### Validation (`/lib/validation.ts`)
- `validateRequest(schema, data)`: Validate with Joi schemas
- Pre-defined schemas: citizen signup/signin, worker, office, complaint, rating, etc.

### Middleware (`/lib/middleware.ts`)
- `getAuthUser(request)`: Extract user from JWT
- `requireAuth(handler)`: Require authentication
- `requireRole(roles, handler)`: Require specific roles
- `requireCitizen/Worker/Office/Admin(handler)`: Role shortcuts

## Security Features

1. **JWT Authentication**: Secure token-based auth with 7-day expiry
2. **Password Hashing**: bcrypt with salt rounds
3. **OTP Verification**: 6-digit OTP with 10-minute expiry
4. **Role-Based Access**: Middleware for role checking
5. **Geolocation Validation**: 10-meter radius check for progress photos
6. **Input Validation**: Joi schemas for all inputs

## Next Steps

1. **Start MongoDB**: `mongod --dbpath /path/to/data`
2. **Configure Cloudinary**: Sign up and add credentials to `.env.local`
3. **Configure Email**: Enable 2FA and create App Password in Gmail
4. **Test APIs**: Use Postman or Thunder Client
5. **Frontend Integration**: Update frontend forms to call APIs
6. **Create Admin User**: Manually insert first admin in MongoDB

## Sample Admin Creation

```javascript
// Run in MongoDB shell or Node.js script
const Admin = require('./models/Admin')
const bcrypt = require('bcryptjs')

const hashedPassword = await bcrypt.hash('admin123', 10)
await Admin.create({
  userId: 'ADMIN001',
  password: hashedPassword,
  role: 'superadmin'
})
```

## Testing the System

1. **Citizen Flow**:
   - Signup → Receive OTP → Verify → Login → Create Complaint → Rate after completion

2. **Office Flow**:
   - Login → View pending complaints → Assign to worker

3. **Worker Flow**:
   - Login → View assigned tasks → Update status → Upload progress photos (at location)

4. **Admin Flow**:
   - Login → View all data → Create workers/offices → Manage system

## Error Handling

All APIs return consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Rate Limiting (TODO)
Consider implementing rate limiting for production using:
- express-rate-limit
- Redis for distributed rate limiting

## Monitoring (TODO)
- Add logging with Winston or Pino
- Implement error tracking with Sentry
- Add API analytics
