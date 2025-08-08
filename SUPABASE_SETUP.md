# Complete Supabase Setup Guide

This guide will help you set up Supabase so your data is shared between your development environment and Render deployment.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up/login with GitHub, Google, or email
4. Click **"New Project"**
5. Choose your organization (or create one)
6. Fill in project details:
   - **Name**: `your-app-name` (e.g., "My Store App")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
7. Click **"Create new project"**
8. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefghij.supabase.co`)
   - **Service Role Key** (starts with `eyJ...` - this is secret!)

## Step 3: Set Up Your Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire content from `code/supabase/migrations/001_create_all_tables.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the migration
6. You should see success message and sample data will be created

## Step 4: Configure Local Development

### Option A: Using Environment Variables (Recommended)

1. In your project root, update the `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Development
NODE_ENV=development
```

### Option B: Using DevServerControl (More Secure)

You can also set environment variables using the DevServerControl tool:

```bash
# This is more secure as it doesn't commit secrets to git
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Configure Render Deployment

1. Log into your [Render dashboard](https://render.com)
2. Go to your web service
3. Click **"Environment"** tab
4. Add these environment variables:

| Variable Name               | Value                                 |
| --------------------------- | ------------------------------------- |
| `SUPABASE_URL`              | `https://your-project-id.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (your service role key)      |

5. Click **"Save Changes"**
6. Your app will automatically redeploy

## Step 6: Verify Everything Works

### Check Local Development:

1. Restart your dev server: `npm run dev`
2. You should see: `✅ Supabase client initialized successfully`
3. Test creating/editing products, customers, and orders
4. Data should persist between page refreshes

### Check Render Deployment:

1. Visit your Render app URL
2. Go to admin panel (`/admin`)
3. Test CRUD operations
4. Verify data persists and is the same as local

## Step 7: Data Sync Verification

Your data is now shared! Here's how to verify:

1. **Add a product locally** in development
2. **Check Render deployment** - the product should appear
3. **Add a customer in Render**
4. **Check locally** - the customer should appear

## Security Notes

### Important Security Considerations:

1. **Service Role Key**: Keep this secret! It has admin access to your database
2. **Row Level Security**: The migration enables RLS with permissive policies for development
3. **Production Setup**: For production, implement proper authentication and stricter RLS policies

### Environment Variable Security:

- ✅ **DO**: Use environment variables in Render
- ✅ **DO**: Use `.env` for local development (add to `.gitignore`)
- ❌ **DON'T**: Commit secrets to git
- ❌ **DON'T**: Share service role keys publicly

## Troubleshooting

### Problem: "Supabase not configured" message

**Solution**: Double-check your environment variables are set correctly and restart the server

### Problem: Database connection errors

**Solution**:

1. Verify your Supabase URL and service role key
2. Check if your Supabase project is active
3. Ensure the migration ran successfully

### Problem: "Could not find the 'createdAt' column" errors

**Symptoms**: You see errors like:
```
Supabase error, falling back to in-memory storage: Could not find the 'createdAt' column of 'customers' in the schema cache
Supabase error, falling back to in-memory storage: Could not find the 'createdAt' column of 'orders' in the schema cache
```

**Solution**: Run the schema fix migration:

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire content from `code/supabase/migrations/002_fix_created_at_columns.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the migration
6. Restart your development server with `npm run dev`

This migration will:
- Add missing `created_at` and `updated_at` columns if they don't exist
- Create necessary indexes
- Set up auto-update triggers
- Refresh the schema cache

### Problem: Data not syncing between environments

**Solution**:

1. Both environments must use the same Supabase project
2. Check environment variables in both places
3. Verify network connectivity

### Problem: Permission errors

**Solution**:

1. Make sure you're using the **Service Role Key**, not the **Anon Key**
2. Check that RLS policies allow your operations

### Problem: Schema cache issues

**Solution**:

1. Run the schema fix migration above
2. In Supabase dashboard, go to **Settings** → **API** → **Schema Cache** and click **Refresh**
3. Restart your application

## Advanced Configuration

### Custom Database Schema:

If you want to modify the database structure:

1. Edit `code/supabase/migrations/001_create_all_tables.sql`
2. Run the updated migration in Supabase SQL Editor
3. Update your TypeScript interfaces accordingly

### Production Security:

For production deployment:

1. Implement proper authentication
2. Create stricter RLS policies
3. Use environment-specific API keys
4. Set up database backups

## Support

If you encounter issues:

1. Check Supabase logs in the dashboard
2. Verify environment variables are correctly set
3. Test database connectivity using Supabase's built-in tools
4. Check network connectivity and firewall settings

Your data will now be persistent and shared between all environments! 🎉
