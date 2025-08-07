# Deployment Guide - Vercel

This project is configured for deployment on Vercel with a React frontend and serverless API backend.

## Prerequisites

1. Vercel account (https://vercel.com)
2. GitHub repository (optional but recommended)

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository
2. Connect your Vercel account to GitHub
3. Import your repository in Vercel dashboard
4. Vercel will automatically detect the configuration and deploy

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI globally:

   ```bash
   npm i -g vercel
   ```

2. Login to your Vercel account:

   ```bash
   vercel login
   ```

3. From your project root, run:

   ```bash
   vercel
   ```

4. Follow the prompts to configure your deployment

## Configuration

The project includes the following configuration files:

- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `api/index.js` - Serverless API handler

## Environment Variables

Set the following environment variables in Vercel dashboard:

- `NODE_ENV=production`
- `PING_MESSAGE=Hello from Vercel` (optional)

## Features

### ✅ Configured Features

- React SPA with routing
- Serverless API endpoints
- Arabic/English language support
- RTL layout support
- CORS handling
- Error handling

### ⚠️ Limitations in Vercel

- File uploads are disabled (use cloud storage like Cloudinary/AWS S3)
- Data is stored in memory (use a database for production)

## API Endpoints

- `GET /api/ping` - Health check
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Production Recommendations

1. **Database Integration**: Replace in-memory storage with a proper database (Supabase, PlanetScale, etc.)
2. **File Storage**: Implement cloud storage for image uploads (Cloudinary, AWS S3)
3. **Authentication**: Add proper authentication/authorization
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Set up error monitoring (Sentry)
6. **Environment Management**: Use proper environment variable management

## Troubleshooting

### Common Issues

1. **API Routes Not Working**

   - Check that `api/index.js` is properly configured
   - Verify API endpoints in Vercel dashboard

2. **Build Failures**

   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in `package.json`

3. **Missing Translations**
   - All translations are included in the codebase
   - Arabic fonts are loaded from the global CSS

### Support

For deployment issues:

- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel dashboard
- Contact Vercel support for platform-specific issues
