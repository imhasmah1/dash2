# Vercel Deployment Setup

## Environment Variables for Supabase (Optional)

If you want to use Supabase instead of the fallback in-memory storage, you need to set these environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Deployment Steps

1. **Connect to Vercel**:
   - Connect your GitHub repository to Vercel
   - Or use Vercel CLI: `vercel`

2. **Build Configuration**:
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/spa`
   - Install Command: `npm install`

3. **API Routes**:
   - All API routes are handled by `/api/index.js`
   - The app automatically falls back to in-memory storage if Supabase is not configured

## Testing

- Frontend will be available at your Vercel domain
- API endpoints will be available at `your-domain.vercel.app/api/...`
- Admin panel at `your-domain.vercel.app/admin`

## Notes

- File uploads are disabled in Vercel deployment (use cloud storage instead)
- In-memory data is reset on each deployment
- For production, configure Supabase for persistent storage
