# Office Management System - Hindi Guide

## ✅ Implement Kiye Gaye Features

### 1. Admin Dashboard Se Office Login Create Karna
Admin apne dashboard se office ke liye login ID bana sakte hain:

**Required Fields:**
- Office Name (naam)
- Category/Department (water, road, sewage, electricity, garbage)
- Mobile Number (10 digit)
- Email Address

**Auto-Generated:**
- Login ID (department ke basis par)
- Password (8 character secure password)

### 2. SMS Notification
Jab office account create hota hai:
- Login ID aur Password automatically SMS ke through phone number par bheja jata hai
- Admin ko bhi screen par credentials dikhte hain

### 3. Forgot Password with OTP Choice
Office user password reset kar sakte hain:
1. User ID enter karein
2. **Email ya Phone - choose karein** ki kahan OTP chahiye
3. 6-digit OTP receive karein
4. OTP aur naya password enter karke reset karein

---

## 🎯 Kaise Use Karein

### Admin Ke Liye: Office Login Banana

**Step 1:** Admin login karein
```
URL: http://localhost:3000/auth/admin
User ID: admin
Password: 12345678
```

**Step 2:** "Offices" tab par click karein

**Step 3:** "Add Office" button click karein

**Step 4:** Form fill karein:
- **Office Name:** Jaise "Municipal Water Department"
- **Department:** Dropdown se select karein (water, road, etc.)
- **Mobile Number:** 10 digit phone number
- **Email:** Valid email address

**Step 5:** Submit karein
- System automatically Login ID generate karega
- Automatically Password generate karega
- Phone number par SMS bhejega credentials ke saath
- Screen par credentials dikhayega

**Step 6:** Credentials save karein
- Login ID aur Password copy karein
- Office staff ko de sakte hain

---

### Office Ke Liye: Password Reset

**Step 1:** Forgot Password page par jaayein
```
URL: http://localhost:3000/auth/office/forgot-password
```

**Step 2:** User ID enter karein
- Apni office login ID dalein
- "Continue" click karein

**Step 3:** Method select karein
- **"Send OTP via Email"** ya **"Send OTP via SMS"** choose karein
- 6-digit OTP aayega

**Step 4:** OTP aur New Password enter karein
- OTP jo receive hua wo dalein
- Naya password dalein (minimum 6 characters)
- Password confirm karein
- "Reset Password" click karein

**Step 5:** Naye password se login karein
- Automatically login page par redirect hoga
- Naye password se login kar sakte hain

---

## 📱 Login ID Format

Department ke pehle 3 letters + Timestamp + Random number:

```
ROA_17305678901  → Road Department
WAT_17305678902  → Water Department  
SEW_17305678903  → Sewage Department
ELE_17305678904  → Electricity Department
GAR_17305678905  → Garbage Department
```

---

## 🔒 Security Features

1. ✅ **Password Hashed:** Sab passwords secure hashed form mein
2. ✅ **OTP Expiry:** OTP sirf 10 minute tak valid
3. ✅ **Unique IDs:** Har office ki unique login ID
4. ✅ **Email/Phone Verify:** Reset se pehle ownership verify
5. ✅ **Admin Only:** Sirf admin office create kar sakte hain

---

## 🧪 Testing

### Test Karne Ke Liye:

1. **Server start karein:**
```bash
npm run dev
```

2. **Admin login:**
```
http://localhost:3000/auth/admin
User ID: admin
Password: 12345678
```

3. **Office create karein:**
- Offices tab → Add Office
- Form fill karein
- Credentials dekh lein

4. **Forgot password test karein:**
```
http://localhost:3000/auth/office/forgot-password
```
- User ID dalein
- Email ya Phone method choose karein
- OTP enter karke password reset karein

---

## 📝 Important Notes

### SMS Functionality:
- Abhi SMS sirf console mein log hota hai
- Real SMS ke liye Twilio ya AWS SNS setup karna hoga
- Configuration `lib/email.ts` file mein hai

### Email Functionality:
- Gmail SMTP use kar raha hai
- `.env.local` mein email credentials add karein
- App Password banana hoga Gmail se

---

## ✅ Summary (Hindi)

**Aapke system mein ab ye sab hai:**

✅ Admin dashboard se office login create kar sakte hain
✅ Sirf 4 fields required - name, category, mobile, email
✅ Login ID aur Password automatic generate hota hai
✅ Phone number par SMS jaata hai credentials ke saath
✅ Office forgot password kar sakta hai
✅ Email ya Phone - dono se OTP le sakte hain
✅ Secure password reset process
✅ Full validation aur error handling

**Start karne ke liye:**
```bash
npm run dev

# Admin se login karein aur office create karein
# Forgot password flow test karein
```

Sab kuch ready hai! 🎉
