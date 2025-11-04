# MongoDB Setup and Testing Guide

## ✅ Database Configuration Complete

### Connection Details
- **MongoDB URI**: `mongodb://localhost:27017/smart_complaint_system`
- **Database Name**: `smart_complaint_system`
- **Collections**: `citizens`, `workers`, `offices`, `admins`, `complaints`

## 🔧 How to Verify Setup

### 1. Check MongoDB Compass

Open MongoDB Compass and connect to:
```
mongodb://localhost:27017
```

After starting the dev server and hitting any API endpoint, you should see:
- Database: `smart_complaint_system`
- Collections: `citizens`, `workers`, `offices`, `admins`, `complaints`

### 2. Test the Health Endpoint

The health check endpoint will initialize all collections and verify the database connection.

**URL**: `http://localhost:3001/api/health`

**Method**: GET

**Expected Response**:
```json
{
  "success": true,
  "message": "MongoDB connection healthy",
  "database": "smart_complaint_system",
  "collections": {
    "created": 5,
    "total": 5,
    "names": ["citizens", "workers", "offices", "admins", "complaints"]
  },
  "stats": {
    "citizens": 0,
    "workers": 0,
    "offices": 0,
    "admins": 0,
    "complaints": 0
  },
  "timestamp": "2025-11-04T..."
}
```

### 3. Test with cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Pretty print with jq (if installed)
curl http://localhost:3001/api/health | jq
```

### 4. Check Server Logs

When the dev server starts and connects to MongoDB, you should see:
```
✅ MongoDB Connected Successfully to smart_complaint_system
📍 Connection URI: mongodb://localhost:27017/smart_complaint_system
```

For subsequent requests (using cached connection):
```
📦 Using cached MongoDB connection
```

## 📊 Collection Schemas

### Citizens Collection
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `phone`: String (unique)
- `password`: String (hashed)
- `otp`: String
- `otpExpiry`: Date
- `verified`: Boolean
- `address`: String
- `complaints`: [ObjectId] (refs)
- `createdAt`: Date
- `updatedAt`: Date

### Workers Collection
- `_id`: ObjectId
- `userId`: String (unique)
- `password`: String (hashed)
- `name`: String
- `department`: Enum (road, water, sewage, electricity, garbage, other)
- `assignedTasks`: [ObjectId] (refs)
- `location`: GeoJSON Point (2dsphere index)
- `status`: Enum (active, inactive)
- `createdAt`: Date
- `updatedAt`: Date

### Offices Collection
- `_id`: ObjectId
- `userId`: String (unique)
- `password`: String (hashed)
- `name`: String
- `department`: Enum
- `workers`: [ObjectId] (refs)
- `complaints`: [ObjectId] (refs)
- `location`: String
- `createdAt`: Date
- `updatedAt`: Date

### Admins Collection
- `_id`: ObjectId
- `userId`: String (unique)
- `password`: String (hashed)
- `name`: String
- `role`: Enum (admin, superadmin)
- `createdAt`: Date
- `updatedAt`: Date

### Complaints Collection
- `_id`: ObjectId
- `citizenId`: ObjectId (ref)
- `title`: String
- `description`: String
- `department`: Enum
- `category`: String
- `media`: Array of {type, url, publicId}
- `location`: GeoJSON Point (2dsphere index)
- `address`: String
- `status`: Enum (pending, assigned, in-progress, completed, rejected)
- `assignedTo`: ObjectId (ref to Worker)
- `officeId`: ObjectId (ref to Office)
- `priority`: Enum (low, medium, high)
- `progressPhotos`: Array with location verification
- `rating`: Number (1-5)
- `feedback`: String
- `completedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

## 🔍 MongoDB Indexes

### Automatic Indexes
All collections have:
- `_id` index (default)
- `createdAt` and `updatedAt` (via timestamps)

### Custom Indexes

**Citizens**:
- Unique index on `email`
- Unique index on `phone`

**Workers**:
- Unique index on `userId`
- 2dsphere geospatial index on `location`

**Offices**:
- Unique index on `userId`

**Admins**:
- Unique index on `userId`

**Complaints**:
- 2dsphere geospatial index on `location`
- Compound index on `citizenId` + `createdAt`
- Compound index on `assignedTo` + `status`
- Compound index on `officeId` + `status`
- Compound index on `department` + `status`

## 🚀 Quick Start Commands

### 1. Ensure MongoDB is Running
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB if not running
sudo systemctl start mongodb

# Or start manually
mongod --dbpath /path/to/data
```

### 2. Start Development Server
```bash
cd "/home/ravi-patel/Ravi Patel/Innotech2025/smart-complaint-syatem"
npm run dev
```

### 3. Initialize Collections
```bash
# Hit the health endpoint to create all collections
curl http://localhost:3001/api/health
```

### 4. Verify in Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You should see `smart_complaint_system` database
4. Expand to see all 5 collections

## 🔧 Troubleshooting

### Database Not Showing in Compass

**Issue**: Database exists but collections don't show up

**Solution**: Collections are only created when the first document is inserted. The health endpoint forces collection creation.

```bash
curl http://localhost:3001/api/health
```

### Connection Refused Error

**Issue**: MongoDB not running

**Solution**:
```bash
# Start MongoDB
sudo systemctl start mongodb

# Or check if it's installed
mongod --version
```

### Wrong Database Name

**Issue**: Collections appearing in different database

**Solution**: Check `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/smart_complaint_system
```

The database name MUST be `smart_complaint_system`.

### Collections Not Auto-Creating

**Issue**: Models defined but collections not appearing

**Solution**: 
1. Import models in API routes
2. Call `Model.createCollection()` explicitly (done in health endpoint)
3. Or insert a document (triggers collection creation)

## 📝 Code Implementation

### Database Connection Function

All API routes use the same connection function:

```typescript
import dbConnect from '@/lib/mongodb'

export async function GET(request: Request) {
  await dbConnect() // Safe, reusable, cached connection
  // ... your code
}
```

### Connection Features
- ✅ Connection pooling and caching
- ✅ Prevents multiple connections in development
- ✅ Automatic reconnection
- ✅ Explicit database name
- ✅ Console logging for debugging

## 🎯 Next Steps

1. **Test Health Endpoint**: Visit `http://localhost:3001/api/health`
2. **Check Compass**: Verify database and collections exist
3. **Create Test Data**: Use API endpoints to create citizens, workers, etc.
4. **Monitor Logs**: Watch terminal for connection messages

## ✅ Verification Checklist

- [ ] MongoDB service is running
- [ ] `.env.local` has correct MONGODB_URI
- [ ] Dev server is running on port 3001
- [ ] Health endpoint returns success
- [ ] Compass shows `smart_complaint_system` database
- [ ] All 5 collections are visible
- [ ] Server logs show "✅ MongoDB Connected Successfully"

---

**All API routes now use `dbConnect()` for consistent, safe database connections!** 🚀
