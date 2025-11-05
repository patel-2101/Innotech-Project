/**
 * Create Test Citizen Account
 * Creates a test citizen account for testing login functionality
 * 
 * Usage: node scripts/create-test-citizen.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_complaint_system'

// Define Citizen Schema
const CitizenSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  address: { type: String, trim: true },
  profilePhoto: { type: String, default: '' },
  otp: { type: String },
  otpExpiry: { type: Date },
  verified: { type: Boolean, default: false },
}, { timestamps: true })

// Model
const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', CitizenSchema)

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Test citizen data
const testCitizens = [
  {
    name: 'Test Citizen 1',
    phone: '9876543210',
    email: 'citizen@test.com',
    password: 'citizen123',
    address: '123 Test Street, Test City',
    verified: true
  },
  {
    name: 'Ravi Patel',
    phone: '9876543211',
    email: 'ravi@test.com',
    password: 'ravi123',
    address: '456 Main Road, Test City',
    verified: true
  },
  {
    name: 'Priya Sharma',
    phone: '9876543212',
    email: 'priya@test.com',
    password: 'priya123',
    address: '789 Park Avenue, Test City',
    verified: true
  }
]

async function createTestCitizens() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n👥 Creating test citizen accounts...')
    
    for (const citizen of testCitizens) {
      try {
        // Check if citizen already exists
        const existing = await Citizen.findOne({ 
          $or: [{ email: citizen.email }, { phone: citizen.phone }] 
        })
        
        if (existing) {
          console.log(`   ⚠️  Citizen already exists: ${citizen.email}`)
          continue
        }

        const hashedPassword = await hashPassword(citizen.password)
        const newCitizen = new Citizen({
          ...citizen,
          password: hashedPassword
        })
        
        await newCitizen.save()
        console.log(`   ✓ Created citizen: ${citizen.email} (password: ${citizen.password})`)
      } catch (err) {
        console.log(`   ✗ Failed to create citizen: ${citizen.email}`, err.message)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ TEST CITIZEN ACCOUNTS CREATED!')
    console.log('='.repeat(60))
    console.log('\n📋 LOGIN CREDENTIALS:\n')
    
    testCitizens.forEach(citizen => {
      console.log(`Name: ${citizen.name}`)
      console.log(`Email: ${citizen.email}`)
      console.log(`Phone: ${citizen.phone}`)
      console.log(`Password: ${citizen.password}`)
      console.log(`Verified: ${citizen.verified}`)
      console.log('')
    })

    console.log('='.repeat(60))
    console.log('💡 TIP: Use these credentials to login at /auth/citizen/signin')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error creating test citizens:', error)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
  }
}

// Run the script
createTestCitizens()
  .then(() => {
    console.log('\n✅ Test citizens created successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
