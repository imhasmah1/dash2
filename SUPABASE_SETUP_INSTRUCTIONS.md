# Supabase Database Setup Instructions

## Quick Setup

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "+ New query"
4. **Copy the SQL schema**: Copy the entire content from `supabase-schema.sql`
5. **Paste and run**: Paste the SQL into the editor and click "Run"

## What the Schema Creates

### Tables
- **categories**: Product categories (Electronics, Accessories, etc.)
- **products**: Your store products with variants, images, and pricing
- **customers**: Customer information including address details
- **orders**: Order history with items, status, and delivery info

### Sample Data
The schema includes sample data to get you started:
- 3 product categories
- 4 sample products with variants
- 3 sample customers
- 2 sample orders

### Features
- **UUID primary keys**: Unique identifiers for all records
- **JSONB fields**: Flexible storage for product variants and images
- **Automatic timestamps**: Created/updated dates are managed automatically
- **Foreign key relationships**: Proper data integrity between tables
- **Indexes**: Optimized for common queries
- **Triggers**: Automatic updated_at timestamp updates

## Environment Variables

After setting up the database, update your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in:
1. **Project URL**: Supabase Dashboard → Settings → API → Project URL
2. **Service Role Key**: Supabase Dashboard → Settings → API → service_role (secret)

## Optional: Enable Row Level Security (RLS)

For production deployment, uncomment the RLS sections in the SQL file to enable security policies.

## Troubleshooting

- If you get permission errors, make sure you're using the service_role key
- If tables already exist, you can drop them first: `DROP TABLE IF EXISTS table_name CASCADE;`
- For fresh start, you can reset your database in Supabase Dashboard → Settings → Database

## File Locations

- **SQL Schema**: `supabase-schema.sql` (copy and paste this into Supabase SQL Editor)
- **Setup Guide**: `SUPABASE_SETUP_INSTRUCTIONS.md` (this file)
- **Environment Config**: `.env` (add your Supabase credentials here)
