/**
 * Add New Admin to Database
 * Adds a new admin account with specified credentials
 * 
 * Usage: node scripts/add-new-admin.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_complaint_system'

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
}, { timestamps: true })

// Model
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// New admin data
const newAdmin = {
  name: 'Admin Manager',
  userId: 'admin',
  password: '12345678',
  role: 'admin',
  email: 'admin@smartcomplaint.com',
  phone: '9123456789'
}

async function addNewAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n👤 Adding new admin account...')
    
    // Check if admin already exists
    const existing = await Admin.findOne({ userId: newAdmin.userId })
    
    if (existing) {
      console.log(`   ⚠️  Admin with userId '${newAdmin.userId}' already exists!`)
      console.log(`   📝 Updating existing admin...`)
      
      // Update existing admin
      const hashedPassword = await hashPassword(newAdmin.password)
      existing.name = newAdmin.name
      existing.password = hashedPassword
      existing.role = newAdmin.role
      existing.email = newAdmin.email
      existing.phone = newAdmin.phone
      await existing.save()
      
      console.log(`   ✅ Admin updated successfully!`)
    } else {
      // Create new admin
      const hashedPassword = await hashPassword(newAdmin.password)
      const admin = new Admin({
        ...newAdmin,
        password: hashedPassword
      })
      
      await admin.save()
      console.log(`   ✅ New admin created successfully!`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ ADMIN ACCOUNT READY!')
    console.log('='.repeat(60))
    console.log('\n📋 LOGIN CREDENTIALS:\n')
    
    console.log(`Name: ${newAdmin.name}`)
    console.log(`User ID: ${newAdmin.userId}`)
    console.log(`Password: ${newAdmin.password}`)
    console.log(`Role: ${newAdmin.role}`)
    console.log(`Email: ${newAdmin.email}`)
    console.log(`Phone: ${newAdmin.phone}`)
    console.log('')

    console.log('='.repeat(60))
    console.log('💡 Login at: http://localhost:3000/auth/admin')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error adding admin:', error)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
  }
}

// Run the script
addNewAdmin()
  .then(() => {
    console.log('\n✅ Admin added successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
