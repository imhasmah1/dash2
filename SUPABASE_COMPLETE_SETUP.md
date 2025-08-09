# Complete Supabase Setup Guide

This guide will help you set up Supabase database integration for your Azhar Store application.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project name: "azhar-store" (or any name you prefer)
5. Enter a strong database password
6. Select your region (choose closest to your users)
7. Click "Create new project"

### Step 2: Set Up Database Schema

1. Wait for your project to be ready (usually 1-2 minutes)
2. In your Supabase dashboard, click "SQL Editor" in the left sidebar
3. Click "+ New query"
4. Copy the entire content from `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click "Run" to execute the schema

### Step 3: Configure Environment Variables

1. In Supabase dashboard, go to Settings → API (in left sidebar)
2. Copy your "Project URL"
3. Copy your "service_role" key (this is the secret key)
4. Update your `.env` file:

```env
# Replace these with your actual values
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
```

### Step 4: Restart Your Application

After updating the `.env` file, restart your development server to apply the changes.

## ✅ Verification

After setup, your application should show:

- ✅ Supabase client initialized successfully (in server logs)
- All CRUD operations working through Supabase instead of in-memory storage
- Data persistence between server restarts

## 🔧 Troubleshooting

### Common Issues:

**1. "⚠️ Supabase not configured" warning**

- Make sure your `.env` file has the correct SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- Ensure there are no extra spaces in the environment variables
- Restart your development server after updating `.env`

**2. "PGRST116" errors**

- This means "no rows found" - it's normal for empty queries
- Not an error, just means the data you're looking for doesn't exist

**3. API errors when editing products**

- Check that your environment variables are properly set
- Look for any console errors in your browser's developer tools
- Check server logs for Supabase connection errors

**4. Data not persisting**

- Verify that console shows "✅ Supabase client initialized successfully"
- If you see fallback warnings, check your environment variables
- Ensure your Supabase project is active and not paused

## 📁 File Structure

Your Supabase integration includes:

```
code/
├── .env                          # Your credentials (don't commit this)
├── .env.example                  # Template for environment variables
├── supabase-schema.sql           # Database schema to run in Supabase
├── SUPABASE_SETUP_INSTRUCTIONS.md # Quick setup guide
├── SUPABASE_COMPLETE_SETUP.md   # This detailed guide
└── server/lib/
    ├── supabase.ts              # Supabase client configuration
    ├── customers-db.ts          # Customer database operations
    └── orders-db.ts             # Order database operations
```

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- The `service_role` key has admin privileges - keep it secure
- For production, consider enabling Row Level Security (RLS)
- Use environment variables specific to each deployment environment

## 🌐 Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Consider enabling RLS policies (commented out in schema)
3. Use separate Supabase projects for development and production
4. Regularly backup your database

## 📞 Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check server logs for Supabase connection messages
3. Verify your environment variables are correctly set
4. Ensure your Supabase project is active

The application will automatically fall back to in-memory storage if Supabase is not configured, so your app will work even without database setup.
