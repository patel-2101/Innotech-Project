# EmailJS Contact Form Setup Guide

## Your EmailJS Credentials
- **Service ID**: `service_bwjujvm`
- **Template ID**: `template_ea3fbet`

## Setup Steps

### 1. Get Your EmailJS Public Key

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin/account)
2. Login to your account
3. Navigate to **Account** → **General**
4. Copy your **Public Key** (it looks like: `user_xxxxxxxxxxxx` or a random string)

### 2. Add Public Key to Environment Variables

1. Open `.env.local` file in your project root
2. Find this line:
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY_HERE
   ```
3. Replace `YOUR_EMAILJS_PUBLIC_KEY_HERE` with your actual public key:
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxx
   ```

### 3. Restart Development Server

After adding the public key, restart your server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## EmailJS Template Variables

Make sure your EmailJS template (`template_ea3fbet`) includes these variables:

- `{{from_name}}` - Full name of the sender
- `{{from_email}}` - Email address of the sender
- `{{phone}}` - Phone number (optional)
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_name}}` - Recipient name (automatically set to "Smart Complaint System Team")

### Example Template Format:

```
New Contact Form Submission

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}
```

## Testing the Contact Form

1. Visit: http://localhost:3000/contact
2. Fill out the form with test data
3. Click "Send Message"
4. Check your EmailJS dashboard for sent emails
5. Check the recipient email inbox

## Features Implemented

✅ Form validation (required fields)
✅ Loading state with spinner
✅ Success message with auto-hide (5 seconds)
✅ Error handling with user-friendly messages
✅ Form reset after successful submission
✅ Responsive design
✅ Dark mode support
✅ Disabled button during submission

## Troubleshooting

### "EmailJS public key not configured" error
- Make sure you've added `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` to `.env.local`
- Restart your development server after adding the key

### Email not being sent
- Check your EmailJS dashboard quota
- Verify service ID and template ID are correct
- Check browser console for error messages
- Ensure template variables match the code

### Form submission stuck
- Check browser console for errors
- Verify internet connection
- Test EmailJS directly from their dashboard

## Contact Form URL

After setup, your contact form will be available at:
- Development: http://localhost:3000/contact
- Production: https://yourdomain.com/contact

---

**Need Help?**
- EmailJS Documentation: https://www.emailjs.com/docs/
- Dashboard: https://dashboard.emailjs.com/
