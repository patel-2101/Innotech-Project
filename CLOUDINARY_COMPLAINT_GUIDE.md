# Cloudinary & Complaint System Setup Guide

## 🖼️ Cloudinary Configuration

### What is Cloudinary?
Cloudinary is a cloud-based service for storing and managing images and videos. It's used in this project for:
- Citizen profile photos
- Complaint images/videos
- Worker progress photos

### Getting Your Cloudinary Credentials

1. **Sign up for Cloudinary** (Free tier available)
   - Go to: https://cloudinary.com/users/register/free
   - Create a free account

2. **Get Your Credentials**
   - After login, go to your Dashboard
   - You'll see three important values:
     - **Cloud Name**: e.g., `dxxxxxxxx`
     - **API Key**: e.g., `123456789012345`
     - **API Secret**: e.g., `abcdefghijklmnopqrstuvwxyz`

3. **Add to `.env.local`**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### File Structure in Cloudinary

The app organizes uploads into folders:
```
cloudinary-root/
├── complaints/          # Complaint images/videos
├── citizen-profiles/    # Citizen profile photos
└── progress/           # Worker progress photos
```

### Cloudinary Features Used

1. **Automatic Format Optimization** - Converts images to best format (WebP, AVIF)
2. **Quality Optimization** - Auto-adjusts quality for best performance
3. **Size Limiting** - Max 1200x1200px to reduce storage
4. **Auto Resource Type** - Detects if file is image or video

## 📋 Complaint System Flow

### 1. Citizen Files Complaint

**API**: `POST /api/complaints/create`

**Data Sent**:
```javascript
{
  title: "Broken Road",
  description: "Large pothole on Main Street",
  department: "road",          // ← Department determines office
  category: "pothole",
  latitude: 23.0225,
  longitude: 72.5714,
  address: "Main Street, Ahmedabad",
  media: [File, File]           // Images/videos
}
```

**What Happens**:
1. ✅ Validates all fields
2. ✅ Uploads images/videos to Cloudinary
3. ✅ Creates complaint in database with:
   - `department: "road"` ← This is the key!
   - `category: "pothole"`
   - `status: "pending"`
   - Media URLs from Cloudinary
   - Location coordinates

### 2. Office Login & View Complaints

**Office Login**:
```
URL: /auth/office
Credentials: 
  - office001 (Road Department)
  - office002 (Water Department)  
  - office003 (Electricity Department)
Password: password123
```

**What Office Sees**:
- Each office has a `department` field (e.g., "road", "water")
- Office can ONLY see complaints where `complaint.department === office.department`

**API**: `GET /api/complaints/all`

**How Filtering Works**:
```typescript
// 1. Get office user from database
const office = await Office.findById(user.id)

// 2. Filter complaints by office's department
query.department = office.department  // e.g., "road"

// 3. Fetch only matching complaints
const complaints = await Complaint.find(query)
```

**Example**:
- **Road Office** (department: "road") sees:
  - ✅ Road repair complaints
  - ✅ Pothole complaints
  - ❌ NOT water complaints
  - ❌ NOT electricity complaints

### 3. Complaint Categories by Department

```javascript
const departmentCategories = {
  road: [
    "pothole",
    "crack",
    "street_light",
    "signage",
    "other"
  ],
  water: [
    "leakage",
    "no_supply",
    "low_pressure",
    "contamination",
    "other"
  ],
  sewage: [
    "blockage",
    "overflow",
    "odor",
    "manhole",
    "other"
  ],
  electricity: [
    "power_outage",
    "wire_damage",
    "transformer",
    "street_light",
    "other"
  ],
  garbage: [
    "not_collected",
    "bin_overflow",
    "illegal_dumping",
    "other"
  ]
}
```

## 🔄 Complete Workflow

### Step-by-Step Process:

1. **Citizen Signup/Login**
   - Create account at `/auth/citizen/signup`
   - Login at `/auth/citizen/login`

2. **File Complaint**
   - Go to complaint form
   - Select department (road/water/sewage/electricity/garbage)
   - Select category (based on department)
   - Add title, description
   - Upload photos/videos (optional)
   - Add location (GPS coordinates)
   - Submit

3. **Complaint Created**
   - Status: `pending`
   - Stored in database with:
     - `department`: Selected department
     - `category`: Selected category
     - `media`: Cloudinary URLs
     - `location`: GPS coordinates

4. **Office Views Complaint**
   - Office logs in
   - System automatically filters complaints by office department
   - Office sees ONLY complaints matching their department

5. **Office Assigns to Worker**
   - Office assigns complaint to worker
   - Worker must be from same department
   - Status changes to `assigned`

6. **Worker Completes Work**
   - Worker uploads progress photos
   - Updates status to `in-progress` → `completed`

7. **Citizen Rates**
   - Citizen can rate completed complaint (1-5 stars)
   - Add feedback

## 🧪 Testing the System

### Test Complaint Creation:

1. **Login as Citizen**
   ```
   URL: /auth/citizen/login
   Create new account if needed
   ```

2. **Create Road Complaint**
   ```javascript
   Department: Road
   Category: Pothole
   Title: "Large pothole on Gandhi Road"
   Description: "Dangerous pothole causing accidents"
   Location: Use current GPS or enter manually
   Photos: Upload 1-2 images
   ```

3. **Login as Road Office**
   ```
   URL: /auth/office
   User ID: office001
   Password: password123
   Department: Road (automatically)
   ```

4. **Verify Office Sees Complaint**
   - Office dashboard should show:
     - ✅ The road complaint you just created
     - ✅ Department: Road
     - ✅ Category: Pothole
     - ✅ All images uploaded

5. **Create Water Complaint**
   ```javascript
   Department: Water
   Category: Leakage
   ```

6. **Login as Water Office**
   ```
   URL: /auth/office
   User ID: office002
   Password: password123
   ```

7. **Verify Department Filtering**
   - Road Office (office001) should see: ✅ Road complaints only
   - Water Office (office002) should see: ✅ Water complaints only

## 📊 Database Schema

### Complaint Document:
```javascript
{
  _id: ObjectId,
  citizenId: ObjectId,              // Who filed it
  department: "road",               // ← Filters office view
  category: "pothole",              // ← Shows in office
  title: "Broken Road",
  description: "...",
  media: [                          // Cloudinary URLs
    {
      type: "image",
      url: "https://res.cloudinary.com/...",
      publicId: "complaints/abc123"
    }
  ],
  location: {
    type: "Point",
    coordinates: [72.5714, 23.0225]  // [lng, lat]
  },
  status: "pending",
  assignedTo: ObjectId,              // Worker (if assigned)
  officeId: ObjectId,                // Office (if assigned)
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 API Endpoints Summary

### Complaint APIs:
- `POST /api/complaints/create` - Create complaint (Citizen)
- `GET /api/complaints/all` - List complaints (filtered by role)
- `GET /api/complaints/my-complaints` - Citizen's complaints
- `POST /api/complaints/assign` - Assign to worker (Office)
- `PATCH /api/complaints/update-status` - Update status (Worker)
- `POST /api/complaints/rate` - Rate complaint (Citizen)

### Photo Upload APIs:
- `POST /api/citizen/update-profile-photo` - Profile photo
- `POST /api/workers/upload-progress` - Progress photos
- Photo uploads in complaint creation (part of form data)

## ⚠️ Important Notes

### Cloudinary Limits (Free Tier):
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

### File Size Limits:
- Profile photos: Max 5MB
- Complaint media: Recommended < 10MB per file
- Progress photos: Max 10MB

### Security:
- Never commit `.env.local` to git
- Keep API secrets secure
- Cloudinary credentials are sensitive

## 🐛 Troubleshooting

### Issue: Photos not uploading
**Solution**:
1. Check `.env.local` has correct Cloudinary credentials
2. Restart server: `npm run dev`
3. Check file size (must be < 5-10MB)
4. Check file format (jpg, png, mp4, etc.)

### Issue: Office sees all complaints
**Solution**:
1. Verify office has `department` field in database
2. Check complaint has matching `department` field
3. Clear browser cache and reload

### Issue: "Invalid credentials" for Cloudinary
**Solution**:
1. Verify credentials on Cloudinary dashboard
2. Copy-paste without extra spaces
3. Restart server after adding credentials

## 📝 Summary

✅ **Cloudinary**: Stores all images/videos
✅ **Department Field**: Links complaints to offices
✅ **Category Field**: Shows complaint type
✅ **Automatic Filtering**: Offices see only their department's complaints
✅ **Ready to Use**: Just add Cloudinary credentials!

---

**Next Steps**:
1. Add your Cloudinary credentials to `.env.local`
2. Restart server: `npm run dev`
3. Test complaint creation with photos
4. Verify office sees complaints by department
