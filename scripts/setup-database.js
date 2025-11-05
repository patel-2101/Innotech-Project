/**
 * Database Setup Script
 * Creates default admin, office, and worker accounts for the Smart Complaint System
 * 
 * Usage: node scripts/setup-database.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_complaint_system'

// Define Schemas (since we're using plain JS)
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
}, { timestamps: true })

const OfficeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  department: { type: String, required: true, enum: ['road', 'water', 'sewage', 'electricity', 'garbage', 'other'] },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  location: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
}, { timestamps: true })

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  department: { type: String, required: true, enum: ['road', 'water', 'sewage', 'electricity', 'garbage', 'other'] },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

// Models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
const Office = mongoose.models.Office || mongoose.model('Office', OfficeSchema)
const Worker = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema)

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Default user data
const defaultUsers = {
  admins: [
    {
      name: 'Super Admin',
      userId: 'admin',
      password: 'admin123',
      role: 'superadmin',
      email: 'admin@smartcomplaint.com',
      phone: '1234567890'
    },
    {
      name: 'Admin User',
      userId: 'admin2',
      password: 'admin123',
      role: 'admin',
      email: 'admin2@smartcomplaint.com',
      phone: '1234567891'
    }
  ],
  offices: [
    {
      name: 'Road Department Office',
      userId: 'office_road',
      password: 'office123',
      department: 'road',
      location: 'City Hall, Block A',
      phone: '2234567890',
      email: 'road@smartcomplaint.com'
    },
    {
      name: 'Water Department Office',
      userId: 'office_water',
      password: 'office123',
      department: 'water',
      location: 'City Hall, Block B',
      phone: '2234567891',
      email: 'water@smartcomplaint.com'
    },
    {
      name: 'Sewage Department Office',
      userId: 'office_sewage',
      password: 'office123',
      department: 'sewage',
      location: 'City Hall, Block C',
      phone: '2234567892',
      email: 'sewage@smartcomplaint.com'
    },
    {
      name: 'Electricity Department Office',
      userId: 'office_electricity',
      password: 'office123',
      department: 'electricity',
      location: 'City Hall, Block D',
      phone: '2234567893',
      email: 'electricity@smartcomplaint.com'
    },
    {
      name: 'Garbage Department Office',
      userId: 'office_garbage',
      password: 'office123',
      department: 'garbage',
      location: 'City Hall, Block E',
      phone: '2234567894',
      email: 'garbage@smartcomplaint.com'
    }
  ],
  workers: [
    {
      name: 'Road Worker 1',
      userId: 'worker_road_1',
      password: 'worker123',
      department: 'road',
      phone: '3234567890',
      email: 'worker.road1@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Road Worker 2',
      userId: 'worker_road_2',
      password: 'worker123',
      department: 'road',
      phone: '3234567891',
      email: 'worker.road2@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Water Worker 1',
      userId: 'worker_water_1',
      password: 'worker123',
      department: 'water',
      phone: '3234567892',
      email: 'worker.water1@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Water Worker 2',
      userId: 'worker_water_2',
      password: 'worker123',
      department: 'water',
      phone: '3234567893',
      email: 'worker.water2@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Sewage Worker 1',
      userId: 'worker_sewage_1',
      password: 'worker123',
      department: 'sewage',
      phone: '3234567894',
      email: 'worker.sewage1@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Electricity Worker 1',
      userId: 'worker_electricity_1',
      password: 'worker123',
      department: 'electricity',
      phone: '3234567895',
      email: 'worker.electricity1@smartcomplaint.com',
      status: 'active'
    },
    {
      name: 'Garbage Worker 1',
      userId: 'worker_garbage_1',
      password: 'worker123',
      department: 'garbage',
      phone: '3234567896',
      email: 'worker.garbage1@smartcomplaint.com',
      status: 'active'
    }
  ]
}

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing data...')
    await Admin.deleteMany({})
    await Office.deleteMany({})
    await Worker.deleteMany({})
    console.log('✅ Existing data cleared')

    // Create Admins
    console.log('\n👤 Creating Admin accounts...')
    for (const admin of defaultUsers.admins) {
      const hashedPassword = await hashPassword(admin.password)
      const newAdmin = new Admin({
        ...admin,
        password: hashedPassword
      })
      await newAdmin.save()
      console.log(`   ✓ Created admin: ${admin.userId} (password: ${admin.password})`)
    }

    // Create Offices
    console.log('\n🏢 Creating Office accounts...')
    for (const office of defaultUsers.offices) {
      const hashedPassword = await hashPassword(office.password)
      const newOffice = new Office({
        ...office,
        password: hashedPassword
      })
      await newOffice.save()
      console.log(`   ✓ Created office: ${office.userId} (password: ${office.password})`)
    }

    // Create Workers
    console.log('\n👷 Creating Worker accounts...')
    for (const worker of defaultUsers.workers) {
      const hashedPassword = await hashPassword(worker.password)
      const newWorker = new Worker({
        ...worker,
        password: hashedPassword
      })
      await newWorker.save()
      console.log(`   ✓ Created worker: ${worker.userId} (password: ${worker.password})`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ DATABASE SETUP COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(60))
    console.log('\n📋 LOGIN CREDENTIALS SUMMARY:\n')
    
    console.log('👤 ADMIN ACCOUNTS:')
    defaultUsers.admins.forEach(admin => {
      console.log(`   User ID: ${admin.userId}`)
      console.log(`   Password: ${admin.password}`)
      console.log(`   Role: ${admin.role}`)
      console.log('')
    })

    console.log('🏢 OFFICE ACCOUNTS:')
    defaultUsers.offices.forEach(office => {
      console.log(`   User ID: ${office.userId}`)
      console.log(`   Password: ${office.password}`)
      console.log(`   Department: ${office.department}`)
      console.log('')
    })

    console.log('👷 WORKER ACCOUNTS:')
    defaultUsers.workers.forEach(worker => {
      console.log(`   User ID: ${worker.userId}`)
      console.log(`   Password: ${worker.password}`)
      console.log(`   Department: ${worker.department}`)
      console.log('')
    })

    console.log('='.repeat(60))
    console.log('💡 TIP: Save these credentials for testing!')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('\n✅ Setup completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  })
