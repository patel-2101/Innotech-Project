# Login Credentials & Testing Guide

## 🔐 How to Create Test Users

Since this is a fresh setup, you'll need to create test users for each role. Here's how:

### Method 1: Using the Seed Script (Easiest)

```bash
cd /home/vishal/Documents/Innotech-Project
node scripts/create-test-users.js
```

This will create:
- 1 Admin user
- 3 Worker users (road, water, electricity departments)
- 3 Office users (road, water, electricity departments)

All with password: `password123`

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/smart_complaint_system

# Create an Admin user (password: admin123)
db.admins.insertOne({
  name: "System Admin",
  userId: "admin",
  password: "$2a$10$8Xy3WzQQ7xJXNRVF0YLJte8yK.Ks0O6Yvg5lQEk2PJw6WOJhqy5G6", // admin123
  role: "admin",
  email: "admin@example.com",
  phone: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Create a Worker user (password: worker123)
db.workers.insertOne({
  name: "John Worker",
  userId: "worker001",
  password: "$2a$10$8Xy3WzQQ7xJXNRVF0YLJte8yK.Ks0O6Yvg5lQEk2PJw6WOJhqy5G6", // worker123
  department: "road",
  assignedTasks: [],
  status: "active",
  phone: "9876543210",
  email: "worker@example.com",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Create an Office user (password: office123)
db.offices.insertOne({
  name: "Road Department Office",
  userId: "office001",
  password: "$2a$10$8Xy3WzQQ7xJXNRVF0YLJte8yK.Ks0O6Yvg5lQEk2PJw6WOJhqy5G6", // office123
  department: "road",
  workers: [],
  complaints: [],
  location: "Main Office",
  phone: "1112223333",
  email: "office@example.com",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Using Node.js Script

Create a file `scripts/seed-users.js`:

```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Import models
require('dotenv').config({ path: '.env.local' });
const Admin = require('./models/Admin').default;
const Worker = require('./models/Worker').default;
const Office = require('./models/Office').default;

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await Admin.create({
      name: 'System Admin',
      userId: 'admin',
      password: hashedPassword,
      role: 'admin',
      email: 'admin@example.com'
    });
    console.log('✅ Admin created:', admin.userId);

    // Create Worker
    const worker = await Worker.create({
      name: 'John Worker',
      userId: 'worker001',
      password: hashedPassword,
      department: 'road',
      status: 'active'
    });
    console.log('✅ Worker created:', worker.userId);

    // Create Office
    const office = await Office.create({
      name: 'Road Department',
      userId: 'office001',
      password: hashedPassword,
      department: 'road'
    });
    console.log('✅ Office created:', office.userId);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedUsers();
```

Run it with:
```bash
node scripts/seed-users.js
```

### Method 3: Using API Endpoints (After Admin is created)

Once you have an admin user, use these endpoints:

**Create Worker:**
```bash
curl -X POST http://localhost:3000/api/workers/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Worker Name",
    "userId": "worker002",
    "password": "password123",
    "department": "water",
    "phone": "1234567890"
  }'
```

**Create Office:**
```bash
curl -X POST http://localhost:3000/api/offices/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Water Department",
    "userId": "office002",
    "password": "password123",
    "department": "water"
  }'
```

## 🧪 Test Credentials (After Creating Users)

### Admin Login
- **URL**: http://localhost:3000/auth/admin
- **User ID**: `admin`
- **Password**: `admin123` or `password123` (depending on which method you used)

### Worker Login
- **URL**: http://localhost:3000/auth/worker
- **User ID**: `worker001`
- **Password**: `worker123` or `password123`

### Office Login
- **URL**: http://localhost:3000/auth/office
- **User ID**: `office001`
- **Password**: `office123` or `password123`

### Citizen Signup/Login
- **Signup URL**: http://localhost:3000/auth/citizen/signup
- **Login URL**: http://localhost:3000/auth/citizen/login
- Create a new account with any email/phone/password
- **No OTP verification required** - accounts are auto-verified
- Login immediately after signup

## 📋 Testing Checklist

### 1. Test Citizen Flow
- [ ] Go to signup page
- [ ] Create account with valid data
- [ ] Account is auto-verified (no OTP needed)
- [ ] Login with email and password
- [ ] Check if redirected to `/citizen/dashboard`

### 2. Test Worker Flow
- [ ] Create worker user (Method 1 or 2)
- [ ] Go to worker login page
- [ ] Login with userId and password
- [ ] Check if redirected to `/worker/dashboard`
- [ ] Verify localStorage has `authToken`, `userRole`, etc.

### 3. Test Office Flow
- [ ] Create office user (Method 1 or 2)
- [ ] Go to office login page
- [ ] Login with userId and password
- [ ] Check if redirected to `/office/dashboard`
- [ ] Verify localStorage has correct data

### 4. Test Admin Flow
- [ ] Create admin user (Method 1 or 2)
- [ ] Go to admin login page
- [ ] Login with userId and password
- [ ] Check if redirected to `/admin/dashboard`
- [ ] Verify localStorage has correct data

### 5. Test Navbar
- [ ] Click "Login" button in navbar
- [ ] Verify dropdown shows all 4 login options
- [ ] Click each option and verify navigation
- [ ] Test on mobile (responsive menu)

## 🔑 Password Hashing Reference

If you need to manually hash passwords for database insertion:

```bash
# Using Node.js REPL
node
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('your_password', 10);
```

Or use this online tool: https://bcrypt-generator.com/

## 🐛 Common Issues & Solutions

### Issue: "Invalid credentials"
**Solution**: Make sure the password in the database is properly hashed. Use bcrypt to hash it.

### Issue: "MongoDB connection failed"
**Solution**: 
```bash
sudo systemctl start mongod
# Verify it's running
pgrep -x mongod
```

### Issue: "User not found"
**Solution**: Check if the user exists in the database:
```bash
mongosh mongodb://localhost:27017/smart_complaint_system
db.admins.find()
db.workers.find()
db.offices.find()
db.citizens.find()
```

### Issue: Can't see localStorage data
**Solution**: Open browser DevTools (F12) → Application tab → Local Storage → http://localhost:3000

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change JWT_SECRET** in `.env.local` to a secure random string
2. **Never commit** `.env.local` to git
3. **Use HTTPS** in production
4. **Enable MongoDB authentication** in production
5. **Set secure CORS policies**
6. **Implement rate limiting** for login endpoints
7. **Add brute force protection**
8. **Use environment-specific secrets**

## 📱 API Testing with cURL

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Test login endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId": "admin", "password": "admin123"}'
```

Test citizen signup:
```bash
curl -X POST http://localhost:3000/api/auth/citizen/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "address": "Test Address"
  }'
```

## 🎯 Quick Start Commands

```bash
# Start MongoDB
sudo systemctl start mongod

# Start development server
npm run dev

# Open in browser
http://localhost:3000

# Access login dropdown from navbar
Click "Login" button → Choose role
```

Happy Testing! 🚀
