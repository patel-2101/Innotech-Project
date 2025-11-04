/**
 * Seed Script to Create Test Users
 * 
 * Run this script to create sample users for testing:
 * node scripts/create-test-users.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
let MONGODB_URI = 'mongodb://localhost:27017/smart_complaint_system';
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoUriMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoUriMatch) {
    MONGODB_URI = mongoUriMatch[1].trim();
  }
} catch (error) {
  console.log('Using default MongoDB URI');
}

// Define schemas inline to avoid module issues
const AdminSchema = new mongoose.Schema({
  name: String,
  userId: String,
  password: String,
  role: String,
  email: String,
  phone: String,
}, { timestamps: true });

const WorkerSchema = new mongoose.Schema({
  name: String,
  userId: String,
  password: String,
  department: String,
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  status: String,
  phone: String,
  email: String,
}, { timestamps: true });

const OfficeSchema = new mongoose.Schema({
  name: String,
  userId: String,
  password: String,
  department: String,
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  location: String,
  phone: String,
  email: String,
}, { timestamps: true });

// Models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Worker = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
const Office = mongoose.models.Office || mongoose.model('Office', OfficeSchema);

async function createTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully\n');

    // Create Admin
    console.log('👤 Creating Admin user...');
    const adminExists = await Admin.findOne({ userId: 'admin' });
    if (adminExists) {
      console.log('⚠️  Admin user already exists, skipping...');
    } else {
      await Admin.create({
        name: 'System Administrator',
        userId: 'admin',
        password: hashedPassword,
        role: 'admin',
        email: 'admin@example.com',
        phone: '1234567890'
      });
      console.log('✅ Admin created successfully');
      console.log('   User ID: admin');
      console.log('   Password: password123');
    }

    // Create Workers
    console.log('\n👷 Creating Worker users...');
    const workers = [
      { name: 'John Worker', userId: 'worker001', department: 'road', email: 'john.worker@example.com', phone: '9876543210' },
      { name: 'Jane Worker', userId: 'worker002', department: 'water', email: 'jane.worker@example.com', phone: '9876543211' },
      { name: 'Bob Worker', userId: 'worker003', department: 'electricity', email: 'bob.worker@example.com', phone: '9876543212' },
    ];

    for (const workerData of workers) {
      const exists = await Worker.findOne({ userId: workerData.userId });
      if (exists) {
        console.log(`⚠️  Worker ${workerData.userId} already exists, skipping...`);
      } else {
        await Worker.create({
          ...workerData,
          password: hashedPassword,
          status: 'active',
          assignedTasks: []
        });
        console.log(`✅ Worker created: ${workerData.userId} (${workerData.department})`);
      }
    }

    // Create Offices
    console.log('\n🏢 Creating Office users...');
    const offices = [
      { name: 'Road Department Office', userId: 'office001', department: 'road', location: 'Main Office Building', email: 'road.office@example.com', phone: '1112223330' },
      { name: 'Water Department Office', userId: 'office002', department: 'water', location: 'Water Works Office', email: 'water.office@example.com', phone: '1112223331' },
      { name: 'Electricity Department Office', userId: 'office003', department: 'electricity', location: 'Power Grid Office', email: 'electricity.office@example.com', phone: '1112223332' },
    ];

    for (const officeData of offices) {
      const exists = await Office.findOne({ userId: officeData.userId });
      if (exists) {
        console.log(`⚠️  Office ${officeData.userId} already exists, skipping...`);
      } else {
        await Office.create({
          ...officeData,
          password: hashedPassword,
          workers: [],
          complaints: []
        });
        console.log(`✅ Office created: ${officeData.userId} (${officeData.department})`);
      }
    }

    console.log('\n✨ All test users created successfully!\n');
    console.log('📋 Login Credentials Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 Admin Login:');
    console.log('   URL: http://localhost:3000/auth/admin');
    console.log('   User ID: admin');
    console.log('   Password: password123');
    console.log('');
    console.log('🟢 Worker Logins:');
    console.log('   URL: http://localhost:3000/auth/worker');
    console.log('   User IDs: worker001, worker002, worker003');
    console.log('   Password: password123 (for all)');
    console.log('');
    console.log('🟣 Office Logins:');
    console.log('   URL: http://localhost:3000/auth/office');
    console.log('   User IDs: office001, office002, office003');
    console.log('   Password: password123 (for all)');
    console.log('');
    console.log('🔵 Citizen Login:');
    console.log('   URL: http://localhost:3000/auth/citizen/signup');
    console.log('   Create your own account with email/phone');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 You can now test all login portals!');

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
createTestUsers();
