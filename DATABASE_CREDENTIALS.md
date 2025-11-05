# Database Setup & Login Credentials

## 🚀 Quick Setup

### 1. Make sure MongoDB is running
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod
```

### 2. Run the database setup script
```bash
node scripts/setup-database.js
```

This will create default accounts for testing.

---

## 📋 Default Login Credentials

### 👤 ADMIN ACCOUNTS

#### Super Admin
- **User ID:** `admin`
- **Password:** `admin123`
- **Role:** superadmin
- **Login URL:** `/auth/admin`

#### Admin User
- **User ID:** `admin2`
- **Password:** `admin123`
- **Role:** admin
- **Login URL:** `/auth/admin`

---

### 🏢 OFFICE ACCOUNTS

#### Road Department
- **User ID:** `office_road`
- **Password:** `office123`
- **Department:** road
- **Login URL:** `/auth/office`

#### Water Department
- **User ID:** `office_water`
- **Password:** `office123`
- **Department:** water
- **Login URL:** `/auth/office`

#### Sewage Department
- **User ID:** `office_sewage`
- **Password:** `office123`
- **Department:** sewage
- **Login URL:** `/auth/office`

#### Electricity Department
- **User ID:** `office_electricity`
- **Password:** `office123`
- **Department:** electricity
- **Login URL:** `/auth/office`

#### Garbage Department
- **User ID:** `office_garbage`
- **Password:** `office123`
- **Department:** garbage
- **Login URL:** `/auth/office`

---

### 👷 WORKER ACCOUNTS

#### Road Workers
- **User ID:** `worker_road_1` | **Password:** `worker123`
- **User ID:** `worker_road_2` | **Password:** `worker123`

#### Water Workers
- **User ID:** `worker_water_1` | **Password:** `worker123`
- **User ID:** `worker_water_2` | **Password:** `worker123`

#### Sewage Worker
- **User ID:** `worker_sewage_1` | **Password:** `worker123`

#### Electricity Worker
- **User ID:** `worker_electricity_1` | **Password:** `worker123`

#### Garbage Worker
- **User ID:** `worker_garbage_1` | **Password:** `worker123`

**Worker Login URL:** `/auth/worker`

---

## 🔧 Customization

To add more users or modify existing ones, edit the `defaultUsers` object in `scripts/setup-database.js`:

```javascript
const defaultUsers = {
  admins: [...],
  offices: [...],
  workers: [...]
}
```

Then re-run the setup script:
```bash
node scripts/setup-database.js
```

---

## ⚠️ Important Notes

1. **Change default passwords in production!**
2. The setup script clears existing data by default
3. To preserve existing data, comment out the delete lines in the script
4. All passwords are hashed using bcrypt before storage
5. Make sure `.env.local` is configured with correct `MONGODB_URI`

---

## 🧪 Testing the Setup

After running the setup script, you can test the login:

```bash
# Start the development server
npm run dev

# Visit http://localhost:3000
# Try logging in with any of the credentials above
```

---

## 👤 CITIZEN TEST ACCOUNTS

To create citizen accounts, run: `node scripts/create-test-citizen.js`

#### Test Citizen 1
- **Email:** `citizen@test.com`
- **Phone:** `9876543210`
- **Password:** `citizen123`
- **Login URL:** `/auth/citizen/signin`

#### Ravi Patel
- **Email:** `ravi@test.com`
- **Phone:** `9876543211`
- **Password:** `ravi123`
- **Login URL:** `/auth/citizen/signin`

#### Priya Sharma
- **Email:** `priya@test.com`
- **Phone:** `9876543212`
- **Password:** `priya123`
- **Login URL:** `/auth/citizen/signin`

**Note:** Only registered citizens can login. New users can signup at `/auth/citizen/signup`

---

## 📞 Departments Available

- **road** - Road repairs and maintenance
- **water** - Water supply issues
- **sewage** - Sewage and drainage problems
- **electricity** - Electrical issues
- **garbage** - Waste management and collection
- **other** - Miscellaneous complaints
