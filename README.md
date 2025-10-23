# Guy Tagger - Portfolio

A modern, high-performance portfolio website built with Angular 18, featuring Server-Side Rendering (SSR) for optimal SEO and Lighthouse scores.

## 🚀 Features

- ✅ **Angular 18** with standalone components
- ✅ **Server-Side Rendering (SSR)** for SEO optimization
- ✅ **Responsive Design** - Mobile, tablet, and desktop
- ✅ **Modern Animations** - Smooth scroll animations and transitions
- ✅ **SEO Optimized** - Meta tags, Open Graph, Schema.org
- ✅ **Performance Optimized** - Target 100 Lighthouse score
- ✅ **Vercel Ready** - One-click deployment
- ✅ **TypeScript** - Type-safe code
- ✅ **SCSS** - Modern styling with variables

## 📋 Prerequisites

- Node.js 22.x or higher
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Serve SSR build
npm run serve:ssr:e2e-portfolio
```

## 🎨 Customization

### Add Your Profile Image

Add your profile photo to `/public/profile.jpg` (recommended size: 800x1000px)

### Update Content

All content can be updated in the component TypeScript files:
- Personal info: `src/app/components/hero/`
- About text: `src/app/components/about/`
- Services: `src/app/components/services/services.ts`
- Testimonials: `src/app/components/testimonials/testimonials.ts`
- Projects: `src/app/components/case-studies/case-studies.ts`

### Update Colors

Modify the color palette in `src/styles.scss`:
```scss
:root {
  --color-primary: #4A90E2;
  --color-secondary: #9C27B0;
  // ... more colors
}
```

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Angular and deploy

### Environment Variables

No environment variables are required for basic deployment.

## 📊 Performance Optimization

This portfolio is optimized for:
- ✅ Lighthouse Performance: 100
- ✅ Lighthouse Accessibility: 100
- ✅ Lighthouse Best Practices: 100
- ✅ Lighthouse SEO: 100

### Optimization Features:
- Server-Side Rendering (SSR)
- Lazy loading images
- Optimized fonts (preconnect)
- Minified CSS/JS
- Cache headers
- Security headers

## 🧩 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── services/
│   │   ├── testimonials/
│   │   ├── case-studies/
│   │   ├── technologies/
│   │   ├── faq/
│   │   ├── contact/
│   │   └── footer/
│   ├── app.ts
│   ├── app.html
│   └── app.scss
├── styles.scss
└── index.html
```

## 🔧 Technologies Used

- **Frontend:** Angular 18, TypeScript, SCSS
- **Rendering:** Server-Side Rendering (SSR)
- **Deployment:** Vercel
- **Version Control:** Git

## 📝 License

© 2025 Guy Tagger. All rights reserved.

## 🤝 Support

For questions or support, contact: hello@guytagger.com

---

Built with ❤️ by Guy Tagger
