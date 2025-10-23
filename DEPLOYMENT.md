# 🚀 Deployment Guide

## Quick Start - Deploy to Vercel

### Step 1: Add Your Profile Image
1. Copy your profile photo to `/public/profile.jpg`
   - Recommended size: 800x1000px
   - Format: JPG or PNG

### Step 2: Deploy

#### Option A: Using Vercel CLI (Fastest)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Using GitHub (Recommended for teams)
1. Create a GitHub repository
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Vercel will auto-detect Angular and configure everything
7. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain (e.g., guytagger.com)
4. Follow the DNS configuration instructions

## 📝 Pre-Deployment Checklist

- [ ] Profile image added to `/public/profile.jpg`
- [ ] Update content in components (if needed)
- [ ] Test locally: `npm start`
- [ ] Test build: `npm run build`
- [ ] Update domain in `src/index.html` (SEO meta tags)
- [ ] Update domain in `public/sitemap.xml`

## ⚡ Performance Tips

Your site is already optimized for 100 Lighthouse score with:
- ✅ Server-Side Rendering (SSR)
- ✅ Optimized bundle sizes (< 100KB gzipped)
- ✅ Preconnect to Google Fonts
- ✅ Security headers configured
- ✅ Cache headers for static assets
- ✅ SEO meta tags and Schema.org markup

## 🔧 Environment Variables

No environment variables are required for basic deployment.

If you want to add analytics or contact form backend, add them in Vercel:
1. Project Settings → Environment Variables
2. Add your variables
3. Redeploy

## 🐛 Troubleshooting

### Build fails on Vercel
- Check Node.js version (should be 22.x)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Styles not loading
- Clear Vercel cache and redeploy
- Check that `dist/e2e-portfolio/browser` is the correct output directory

### Profile image not showing
- Ensure image is in `/public/profile.jpg`
- Check image file size (should be < 500KB)
- Verify image format (JPG or PNG)

## 📊 Monitor Performance

After deployment:
1. Test with [PageSpeed Insights](https://pagespeed.web.dev/)
2. Check [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
3. Monitor in Vercel Analytics dashboard

## 🎯 Expected Results

- **Lighthouse Performance:** 95-100
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Total Blocking Time:** < 300ms

---

Need help? Check the [main README](README.md) or contact support.

