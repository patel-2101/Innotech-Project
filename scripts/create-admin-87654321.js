/**
 * Create Admin Account with Specific Credentials
 * Creates/Updates admin account with userId: admin and password: 87654321
 * 
 * Usage: node scripts/create-admin-87654321.js
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

// Admin credentials - EXACTLY as specified
const adminData = {
  name: 'Admin Manager',
  userId: 'admin',
  password: '87654321',  // EXACT PASSWORD AS REQUESTED
  role: 'admin',
  email: 'admin@smartcomplaint.com',
  phone: '9123456789'
}

async function createOrUpdateAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    console.log('👤 Processing admin account...')
    
    // Check if admin already exists
    const existing = await Admin.findOne({ userId: adminData.userId })
    
    if (existing) {
      console.log(`   ⚠️  Admin '${adminData.userId}' already exists!`)
      console.log(`   📝 Updating with new password...`)
      
      // Update existing admin with new password
      const hashedPassword = await hashPassword(adminData.password)
      existing.name = adminData.name
      existing.password = hashedPassword
      existing.role = adminData.role
      existing.email = adminData.email
      existing.phone = adminData.phone
      await existing.save()
      
      console.log(`   ✅ Admin updated successfully!\n`)
    } else {
      // Create new admin
      console.log(`   📝 Creating new admin account...`)
      const hashedPassword = await hashPassword(adminData.password)
      const admin = new Admin({
        ...adminData,
        password: hashedPassword
      })
      
      await admin.save()
      console.log(`   ✅ New admin created successfully!\n`)
    }

    console.log('='.repeat(70))
    console.log('✅ ADMIN ACCOUNT READY!')
    console.log('='.repeat(70))
    console.log('\n📋 LOGIN CREDENTIALS:\n')
    
    console.log(`   Name:     ${adminData.name}`)
    console.log(`   User ID:  ${adminData.userId}`)
    console.log(`   Password: ${adminData.password}`)
    console.log(`   Role:     ${adminData.role}`)
    console.log(`   Email:    ${adminData.email}`)
    console.log(`   Phone:    ${adminData.phone}`)
    console.log('')

    console.log('='.repeat(70))
    console.log('🌐 Login URL: http://localhost:3000/auth/admin')
    console.log('='.repeat(70))
    console.log('')
    console.log('💡 TIP: Copy these credentials and try logging in now!')
    console.log('')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed\n')
  }
}

// Run the script
createOrUpdateAdmin()
  .then(() => {
    console.log('✅ Script completed successfully\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  })
