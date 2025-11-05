# 🧪 Testing Checklist - Complaint System

## ✅ Complete This Checklist to Verify Everything Works

---

## 1️⃣ Photo Upload Test

### Steps:
- [ ] Start server: `npm run dev`
- [ ] Open: http://localhost:3000/auth/citizen/login
- [ ] Login: `citizen1@test.com` / `citizen123`
- [ ] Create new complaint:
  - Title: "Road Damage Test"
  - Department: **Road**
  - Upload 2-3 photos
  - Add location/address
- [ ] Submit successfully
- [ ] Verify no console errors

### Expected Result:
✅ Complaint created with photos uploaded to Cloudinary

---

## 2️⃣ Department Filtering Test

### Part A: Road Office
- [ ] Logout from citizen account
- [ ] Open: http://localhost:3000/auth/office/page
- [ ] Login: `office001` / `office123` (Road Dept)
- [ ] Dashboard shows "Road Damage Test" complaint
- [ ] Statistics show correct counts
- [ ] No water/sewage complaints visible

### Part B: Water Office
- [ ] Logout from Road Office
- [ ] Login: `office002` / `office123` (Water Dept)
- [ ] "Road Damage Test" complaint **NOT visible**
- [ ] Only water department complaints shown
- [ ] Statistics reflect water complaints only

### Expected Result:
✅ Each office sees only their department's complaints

---

## 3️⃣ Complaint Details Test

- [ ] Click "View" on any complaint
- [ ] Modal opens with full details
- [ ] Photos/videos display correctly
- [ ] Location shows address
- [ ] Citizen info visible
- [ ] All fields populated correctly

### Expected Result:
✅ Complete complaint information displayed with media

---

## 4️⃣ Worker Assignment Test

- [ ] Find a "pending" complaint
- [ ] Click "Assign" button
- [ ] Modal opens with worker dropdown
- [ ] Workers listed belong to same department
- [ ] Select a worker
- [ ] Set priority (high/medium/low)
- [ ] Click "Assign Worker"
- [ ] Status changes to "assigned"
- [ ] Worker name appears in table

### Expected Result:
✅ Worker successfully assigned, status updated

---

## 5️⃣ Multi-Department Test

### Create complaints for each department:

**Road Complaint:**
- [ ] Login as citizen1
- [ ] Create complaint with department: **Road**
- [ ] Upload photo
- [ ] Submit

**Water Complaint:**
- [ ] Login as citizen2 (or same citizen)
- [ ] Create complaint with department: **Water**
- [ ] Upload photo
- [ ] Submit

**Verify Filtering:**
- [ ] Login as office001 (Road) → See only road complaint
- [ ] Login as office002 (Water) → See only water complaint

### Expected Result:
✅ Department filtering works for multiple departments

---

## 🎯 Success Criteria

All tests passed if:
- ✅ Photos upload without errors
- ✅ Complaints saved with correct data structure
- ✅ Office dashboards show only relevant complaints
- ✅ Statistics calculate correctly
- ✅ Worker assignment works
- ✅ Complaint details display properly
- ✅ No console errors
- ✅ Department filtering is accurate

---

## 🐛 If Any Test Fails

### Photo Upload Issues:
```bash
# 1. Check Cloudinary credentials in .env.local
# 2. Restart server
npm run dev
```

### Department Filtering Issues:
```bash
# 1. Check MongoDB data
# Verify office documents have "department" field
# Verify complaint documents have "department" field matching enum

# 2. Check browser console for API errors
# Look for /api/complaints/all errors
```

### Worker Assignment Issues:
```bash
# 1. Verify worker exists in database
# 2. Check worker department matches complaint department
# 3. Check /api/complaints/assign endpoint
```

---

## 📊 Test Data Reference

### Test Complaints to Create:

| Title | Department | Category | Should Appear In |
|-------|-----------|----------|------------------|
| "Road Pothole Issue" | road | Pothole | office001 |
| "Water Leak Problem" | water | Leakage | office002 |
| "Sewage Blockage" | sewage | Blockage | office003 |
| "Streetlight Broken" | electricity | Lighting | (Create office if needed) |

---

## ✨ Bonus Tests

### Mobile Responsiveness:
- [ ] Test on phone browser
- [ ] Complaint form works on mobile
- [ ] Photo upload works from camera
- [ ] Dashboard table scrolls horizontally
- [ ] Modals display properly

### Performance:
- [ ] Page loads within 2 seconds
- [ ] Photo upload completes within 5 seconds
- [ ] Statistics update immediately
- [ ] No lag when opening modals

---

## 📝 Report Results

After testing, note any issues:

**Issues Found:**
- [ ] None - everything working! ✅
- [ ] Photo upload: _______________
- [ ] Department filtering: _______________
- [ ] Worker assignment: _______________
- [ ] UI/UX: _______________

**Overall Status:**
- [ ] ✅ Ready for production
- [ ] ⚠️ Minor issues to fix
- [ ] ❌ Major issues found

---

## 🚀 Ready to Deploy?

If all tests pass:
1. ✅ Cloudinary working
2. ✅ Department filtering accurate
3. ✅ Worker assignment functional
4. ✅ No console errors
5. ✅ UI responsive

**Then you're ready to deploy!** 🎉
