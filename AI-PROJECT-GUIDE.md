# AI Assistant Project Guide
## Guy Tagger Portfolio - Rules & Best Practices

This document serves as the comprehensive guide for AI assistants working on this project. It contains all project rules, structure, conventions, and best practices.

---

## 🎯 Project Overview

**Project Name:** Guy Tagger Portfolio  
**Tech Stack:** Angular 18 (Standalone Components), TypeScript 5.9, SCSS, SSR  
**Deployment:** Vercel  
**Performance Target:** Lighthouse 100 across all metrics

### Core Principles
1. **Best Practice First** - Always follow Angular and web development best practices
2. **Performance Matters** - Keep bundle sizes minimal, optimize everything
3. **SEO Optimized** - Server-Side Rendering for maximum SEO impact
4. **Modern UI/UX** - Clean, responsive, accessible design
5. **Type Safety** - Strict TypeScript, no implicit any

---

## 📁 Project Structure

```
e2e-portfolio/
├── src/
│   ├── app/
│   │   ├── components/          # Feature components (header, hero, services, etc.)
│   │   │   ├── about/
│   │   │   ├── case-studies/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── hero/
│   │   │   ├── project-inquiry/
│   │   │   ├── scroll-to-top/
│   │   │   ├── services/
│   │   │   ├── technologies/
│   │   │   └── testimonials/
│   │   ├── pages/               # Page components (home, about-page, etc.)
│   │   │   ├── home/
│   │   │   ├── about-page/
│   │   │   ├── projects-page/
│   │   │   ├── service-detail/
│   │   │   └── services-page/
│   │   ├── app.ts               # Root component
│   │   ├── app.html             # App template
│   │   ├── app.scss             # App styles
│   │   ├── app.routes.ts        # Client routes
│   │   ├── app.routes.server.ts # SSR routes
│   │   ├── app.config.ts        # App configuration
│   │   └── app.config.server.ts # SSR configuration
│   ├── styles.scss              # Global styles & CSS variables
│   ├── index.html               # HTML with SEO meta tags
│   ├── main.ts                  # Client bootstrap
│   ├── main.server.ts           # SSR bootstrap
│   └── server.ts                # Express server for SSR
├── public/                      # Static assets (favicon, robots.txt, sitemap.xml)
├── dist/                        # Build output (gitignored)
├── angular.json                 # Angular CLI configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── vercel.json                  # Vercel deployment config
└── README.md                    # Public documentation
```

---

## 🎨 Design System

### Colors & Styling
- Colors and design tokens are defined in `src/styles.scss` using CSS variables
- Design system may evolve, refer to `src/styles.scss` for current values

### Breakpoints
- **768px** - Small tablets and up
- **991px** - Tablets and up  
- **1200px** - Desktop and up
- **1440px** - Large desktop and up

Use min-width media queries:
```scss
// Mobile first (default)
.component { }

// 768px and up
@media (min-width: 768px) { }

// 991px and up
@media (min-width: 991px) { }

// 1200px and up
@media (min-width: 1200px) { }

// 1440px and up
@media (min-width: 1440px) { }
```

---

## ⚡ Component Conventions

### Component Structure
All components follow this pattern:

```
component-name/
├── component-name.ts        # Component logic (TypeScript)
├── component-name.html      # Template
├── component-name.scss      # Styles
└── component-name.spec.ts   # Tests (optional)
```

### Component Best Practices
1. **Standalone Components** - Default in Angular 18+ (no need to declare)
2. **OnPush Change Detection** - Use for performance optimization
3. **Signals** - Use Angular signals for reactive state when appropriate
4. **TypeScript Strict Mode** - No implicit any
5. **Clean Imports** - Import only what's needed
6. **Semantic HTML** - Use proper HTML5 elements
7. **Accessibility** - Add ARIA labels, semantic structure, keyboard navigation

### Component Template Example
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  imports: [CommonModule],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentNameComponent {
  // Component logic
}
```

**Note:** `standalone: true` is the default in Angular 18+, no need to explicitly declare it.

---

## 🎯 Key Components

### Project Inquiry Component
**Location:** `src/app/components/project-inquiry/`

**Purpose:** Interactive inquiry form replacing traditional CTA buttons

**Features:**
- Flexible input: Description OR project type selection OR both
- 6 project types: Website, Application, AI Automation, E-commerce, Design, Consulting
- Modal-based contact form
- Mailto integration (can be upgraded to API)
- Glassmorphism design with smooth animations

**Validation:** Users must provide either description, select types, or both

**Customization:**
- Project types: Edit `projectTypes` array
- Email recipient: Update in `submitInquiry()` method
- Styling: Modify `project-inquiry.scss`

---

## 🚀 Performance Optimization

### Bundle Size Targets
- **Main JS:** < 100KB gzipped
- **Styles:** < 5KB gzipped
- **Total Initial Load:** < 150KB

### Current Performance
- Main JS: 84.63 KB (gzipped) ✅
- Styles: 1.56 KB (gzipped) ✅

### Optimization Techniques
1. **SSR** - Server-Side Rendering enabled
2. **Tree Shaking** - Unused code removed
3. **Lazy Loading** - Route-based code splitting ready
4. **Minification** - CSS/JS minified in production
5. **Preconnect** - Google Fonts preconnected
6. **Cache Headers** - Configured in vercel.json
7. **Security Headers** - CSP, HSTS configured

### Lighthouse Targets
- **Performance:** 95-100 ⚡
- **Accessibility:** 100 ♿
- **Best Practices:** 100 ✅
- **SEO:** 100 🔍

---

## 🔍 SEO Implementation

### Meta Tags (in `src/index.html`)
- Title, description, keywords
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URLs
- Language declaration

### Structured Data (Schema.org)
- Person schema for Guy Tagger
- Organization schema
- WebSite schema
- JSON-LD format

### Additional SEO Files (in `/public`)
- **robots.txt** - Search engine crawler instructions
- **sitemap.xml** - Site structure for search engines

### SEO Best Practices
- Semantic HTML5 elements
- Alt text on all images
- Descriptive link text
- Heading hierarchy (h1 > h2 > h3)
- Fast loading times

---

## 📱 Responsive Design Rules

### Mobile-First Approach
1. Design for mobile first
2. Progressive enhancement for larger screens
3. Touch-friendly targets (min 44x44px)
4. Readable font sizes (min 16px on mobile)

### Responsive Patterns
Use the project's breakpoints: **768px, 991px, 1200px, 1440px**

---

## 🎨 Animation Guidelines

### Animation Best Practices
1. Use `transform` and `opacity` for performance
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` sparingly
4. Respect `prefers-reduced-motion`

---

## 📦 Dependencies & Versions

### Important Notes
- Keep dependencies updated but test thoroughly
- Avoid adding unnecessary packages
- Prefer Angular built-in solutions over external libraries

---

## 🚀 Build & Deployment

### Development Commands
```bash
npm start                        # Dev server (port 4200)
npm run build                    # Production build
npm run serve:ssr:e2e-portfolio # Serve SSR build locally
npm test                         # Run tests (if implemented)
```

### Vercel Deployment
**Configuration:** `vercel.json`
```json
{
  "version": 2,
  "outputDirectory": "dist/e2e-portfolio/browser",
  "framework": "angular"
}
```

**Deployment Options:**
1. **Vercel CLI:** `vercel --prod`
2. **GitHub Integration:** Auto-deploy on push to main

### Pre-Deployment Checklist
- [ ] Profile image added to `/public/profile.jpg`
- [ ] Test locally: `npm start`
- [ ] Test build: `npm run build`
- [ ] Update domain in meta tags (if custom domain)
- [ ] Verify no console errors
- [ ] Test on mobile devices

---

## 🔧 Code Style & Conventions

### TypeScript
- Use strict mode
- No implicit any
- Prefer const over let
- Use meaningful variable names
- Document complex logic with comments

### SCSS
- Use CSS variables for colors and spacing
- BEM naming convention for classes (optional)
- Nest selectors max 3 levels deep
- Group related styles together
- Use mixins for reusable patterns

### HTML
- Semantic elements (header, nav, main, section, article, footer)
- Proper heading hierarchy
- Alt text on images
- ARIA labels when needed
- Valid HTML5

---

## 🛡️ Security

### Headers (configured in `vercel.json`)
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer-when-downgrade
- Permissions-Policy

### Best Practices
- No sensitive data in client code
- Sanitize user input (if forms submit to backend)
- HTTPS only (enforced by Vercel)
- Regular dependency updates

---

## ♿ Accessibility Standards

### WCAG 2.1 Level AA Compliance
- [ ] Keyboard navigation support
- [ ] Screen reader friendly
- [ ] Color contrast ratios (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels where needed
- [ ] Semantic HTML structure

### Testing
- Use browser accessibility tools
- Test with keyboard only
- Test with screen reader (VoiceOver, NVDA)

---

## 📊 Analytics & Monitoring

### Post-Launch Recommendations
- Vercel Analytics (built-in)
- Google Analytics 4 (optional)
- Google Search Console
- PageSpeed Insights monitoring
- Uptime monitoring

---

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version (22.x required)
- Clear node_modules and reinstall
- Check for TypeScript errors

**SSR Issues:**
- Ensure window/document checks for browser-only code
- Check server.ts configuration

**Styles Not Loading:**
- Verify SCSS imports
- Check build output directory
- Clear Vercel cache

**Profile Image Not Showing:**
- Ensure file is in `/public/profile.jpg`
- Check file format (JPG/PNG)
- Verify file size < 500KB

---

## 🔄 Future Enhancements (Ideas)

### Short-term
- Contact form backend integration (EmailJS, Formspree)
- Google Analytics integration
- Blog section
- Project detail pages
- Dark/Light mode toggle

### Long-term
- Multi-language support (i18n)
- CMS integration
- Advanced animations
- 3D elements
- Interactive portfolio pieces

---

## 📞 Contact & Support

**Owner:** Guy Tagger  
**Email:** hello@guytagger.com  
**Website:** guytagger.com

---

## 🎓 Learning Resources

### Angular
- [Angular Docs](https://angular.dev)
- [Angular SSR Guide](https://angular.dev/guide/ssr)

### Performance
- [Web.dev Performance](https://web.dev/performance)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### SEO
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)

---

## ✅ AI Assistant Rules

When working on this project:

1. **Always follow best practices** - Code quality over quick fixes
2. **Maintain consistency** - Follow established patterns
3. **Test changes** - Ensure no breaking changes
4. **Performance first** - Keep bundle sizes small
5. **Document changes** - Update this guide if architecture changes
6. **Respect existing structure** - Don't refactor unnecessarily
7. **SEO awareness** - Maintain or improve SEO implementation
8. **Accessibility** - Never reduce accessibility features
9. **TypeScript strict** - No any types without good reason
10. **Mobile-first** - Always consider mobile experience

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Built with:** Angular 18, TypeScript, SCSS, Love ❤️

