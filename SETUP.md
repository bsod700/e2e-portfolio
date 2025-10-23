# 🎯 Quick Setup Guide

## 1️⃣ Add Your Profile Image

**IMPORTANT:** Before running the project, add your profile photo:

```bash
# Copy your profile photo to the public folder
cp /path/to/your/photo.jpg public/profile.jpg
```

Or manually:
1. Open the `/public` folder
2. Add your profile image as `profile.jpg`
3. Recommended size: 800x1000px (portrait)

## 2️⃣ Install & Run

```bash
# Install dependencies (already done if you just created the project)
npm install

# Start development server
npm start
```

The app will open at `http://localhost:4200`

## 3️⃣ Customize Content (Optional)

### Update Personal Information
Edit these files to customize your content:

**Hero Section** - `src/app/components/hero/hero.html`
- Name and tagline
- Tech badges

**About Section** - `src/app/components/about/about.html`
- Your bio and description

**Services** - `src/app/components/services/services.ts`
- Services you offer

**Testimonials** - `src/app/components/testimonials/testimonials.ts`
- Client reviews

**Projects** - `src/app/components/case-studies/case-studies.ts`
- Your portfolio projects

**Contact** - `src/app/components/contact/contact.html`
- Email and social links

### Update Colors
Edit `src/styles.scss` and modify the CSS variables:

```scss
:root {
  --color-primary: #4A90E2;      // Change your primary color
  --color-secondary: #9C27B0;    // Change your secondary color
  // ... etc
}
```

## 4️⃣ Deploy to Vercel

When you're ready to deploy:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or use GitHub integration (see [DEPLOYMENT.md](DEPLOYMENT.md))

## 📱 What You Get

✅ Fully responsive portfolio website
✅ Hero section with animations
✅ About section with your photo
✅ Services showcase
✅ Client testimonials
✅ Project case studies
✅ Technologies grid
✅ FAQ section
✅ Contact form
✅ SEO optimized (ready for Google)
✅ 100 Lighthouse score potential
✅ Vercel deployment ready

## 🎨 Features

- **Modern Design:** Dark theme with gradients and glass-morphism effects
- **Smooth Animations:** Fade-ins, hover effects, and scroll animations
- **Responsive:** Works perfectly on mobile, tablet, and desktop
- **Fast:** Optimized bundle sizes and SSR for speed
- **SEO Ready:** Meta tags, Schema.org, Open Graph, and sitemap

## 🆘 Need Help?

- **Documentation:** See [README.md](README.md)
- **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues:** Check the console for any errors

---

**You're all set!** 🚀 Start the dev server and see your portfolio come to life!

