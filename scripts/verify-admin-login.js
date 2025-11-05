/**
 * Verify Admin Login
 * Quick test to verify admin credentials work
 * 
 * Usage: node scripts/verify-admin-login.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_complaint_system'

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  email: String,
  phone: String,
}, { timestamps: true })

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function verifyAdminLogin() {
  try {
    console.log('\n🔍 Verifying Admin Login...\n')
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected\n')

    // Test credentials
    const testUserId = 'admin'
    const testPassword = '87654321'

    console.log('🔐 Testing credentials:')
    console.log(`   User ID: ${testUserId}`)
    console.log(`   Password: ${testPassword}\n`)

    // Find admin
    const admin = await Admin.findOne({ userId: testUserId })

    if (!admin) {
      console.log('❌ FAILED: Admin account not found!')
      console.log('   Run: node scripts/create-admin-87654321.js\n')
      return false
    }

    console.log('✅ Admin account found')
    console.log(`   Name: ${admin.name}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`   Email: ${admin.email || 'N/A'}`)
    console.log(`   Created: ${admin.createdAt.toLocaleDateString()}\n`)

    // Verify password
    const isValid = await bcrypt.compare(testPassword, admin.password)

    if (isValid) {
      console.log('✅ PASSWORD VERIFICATION: SUCCESS!\n')
      console.log('='.repeat(70))
      console.log('✅ ADMIN LOGIN IS WORKING!')
      console.log('='.repeat(70))
      console.log('\n📝 You can now login with:')
      console.log(`   User ID:  ${testUserId}`)
      console.log(`   Password: ${testPassword}`)
      console.log('\n🌐 Login URL: http://localhost:3000/auth/admin')
      console.log('')
      return true
    } else {
      console.log('❌ PASSWORD VERIFICATION: FAILED!\n')
      console.log('⚠️  The password in database does not match!')
      console.log('   Run this to fix: node scripts/create-admin-87654321.js\n')
      return false
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    return false
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed\n')
  }
}

verifyAdminLogin()
  .then((success) => {
    if (success) {
      console.log('✅ Verification complete - All systems ready!\n')
      process.exit(0)
    } else {
      console.log('❌ Verification failed - Please fix the issues above\n')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('❌ Verification script error:', error.message)
    process.exit(1)
  })
