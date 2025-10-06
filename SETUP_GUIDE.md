# 🚀 Nightmare Racing Database Setup Guide

## Step 1: Get Your Neon Database Connection String

1. **Go to your Neon Dashboard**: [https://console.neon.tech](https://console.neon.tech)
2. **Select your database** (the one you created with Netlify)
3. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@ep-example-12345.us-east-1.aws.neon.tech/database_name
   ```

   postgresql://neondb_owner:npg_Na8FzyBL2qQI@ep-divine-flower-adb4f8ol-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## Step 2: Add Environment Variable to Netlify

1. **Go to your Netlify Dashboard**: [https://app.netlify.com](https://app.netlify.com)
2. **Select your Nightmare Racing site**
3. **Go to**: Site settings → Environment variables
4. **Add a new variable**:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string from Step 1
5. **Click "Save"**

## Step 3: Test the Connection (Local)

If you want to test locally first:

```bash
# Set environment variable locally (temporary)
export DATABASE_URL="your_neon_connection_string_here"

# Test the connection
node test-connection.js
```

## Step 4: Initialize Database Tables

```bash
# This creates the car tables and sample data
npm run db:setup
```

## Step 5: Deploy and Test

1. **Deploy your site**:
   ```bash
   git add .
   git commit -m "Setup database integration"
   git push
   ```

2. **Test the API endpoint** in your browser:
   ```
   https://your-site-name.netlify.app/.netlify/functions/api-cars
   ```

## Step 6: Test Admin Panel

1. **Go to your admin panel**: `https://your-site-name.netlify.app/admin`
2. **Log in** with Netlify Identity
3. **Try adding a car** through the admin interface
4. **Check your cars page** to see if it appears in the carousel

## 🔧 Troubleshooting

### If the API returns an error:
- Check that DATABASE_URL is set correctly in Netlify
- Verify your Neon database is active
- Check the Function logs in Netlify dashboard

### If cars don't appear on the site:
- Make sure you've run `npm run db:setup`
- Check the API endpoint works: `/.netlify/functions/api-cars`
- Look at browser console for JavaScript errors

### If admin panel doesn't work:
- Ensure Netlify Identity is enabled
- Check that you're invited as a user
- Verify Git Gateway is enabled in Netlify Identity settings

### If authentication gets stuck or "Opening login modal..." doesn't work:
1. **Try the "Refresh Page" button** in the admin login screen
2. **Clear your browser cache and cookies** for the site
3. **Check browser console** for any JavaScript errors
4. **Try incognito/private browsing** to rule out extensions
5. **Verify your email is added** in Netlify Identity dashboard
6. **Wait 30 seconds** then try login again (sometimes there's a delay)
7. **Check Netlify Identity status** - make sure it's not down

### If login modal opens but won't accept credentials:
- **Check your password** - try resetting it in Netlify Identity
- **Verify email verification** - check if you need to confirm your email
- **Try different browser** - some browsers have stricter security
- **Disable browser extensions** temporarily

## 📂 What This Setup Does

✅ **Database**: Cars stored in Neon PostgreSQL database  
✅ **API**: Serverless functions provide car data  
✅ **Admin**: Custom admin panel to manage cars  
✅ **Frontend**: Cars page loads from database via API  
✅ **Real-time**: Changes in admin appear immediately on site  

## 🎯 Next Steps

Once everything works:
1. **Customize the car fields** in the admin panel
2. **Add more sample cars** through the admin
3. **Style the car display** on your cars page
4. **Set up image uploads** for car photos