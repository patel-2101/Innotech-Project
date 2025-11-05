/**
 * Script to update existing offices with plainPassword field
 * This is needed because older offices were created without plainPassword
 * 
 * Run with: node scripts/update-office-passwords.js
 */

const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_complaint_system'

// Office Schema
const OfficeSchema = new mongoose.Schema({
  name: String,
  userId: String,
  password: String,
  plainPassword: String,
  department: String,
  phone: String,
  email: String,
})

const Office = mongoose.models.Office || mongoose.model('Office', OfficeSchema)

async function updateOfficePasswords() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Find all offices without plainPassword
    const offices = await Office.find({
      $or: [
        { plainPassword: { $exists: false } },
        { plainPassword: null },
        { plainPassword: '' }
      ]
    })

    console.log(`\nFound ${offices.length} offices without plainPassword field`)

    if (offices.length === 0) {
      console.log('✓ All offices already have plainPassword field!')
      process.exit(0)
    }

    console.log('\n⚠️  WARNING: These offices need manual password reset:')
    console.log('   Passwords are hashed and cannot be recovered.')
    console.log('   You have two options:')
    console.log('   1. Let office users use "Forgot Password" feature')
    console.log('   2. Manually set new passwords for these offices\n')

    for (const office of offices) {
      console.log(`   - ${office.userId} (${office.name}) - ${office.email}`)
    }

    console.log('\n📝 To set new passwords, you can:')
    console.log('   1. Use the admin dashboard to create new offices')
    console.log('   2. Or update existing offices using the forgot password flow')
    console.log('\n✓ Script completed. No changes made to database.')

  } catch (error) {
    console.error('✗ Error:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

// Run the script
updateOfficePasswords()
