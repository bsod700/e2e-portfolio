# 🚀 Email Setup - Quick Start

## 1. Install Dependencies

```bash
npm install
```

## 2. Environment Variables

Create `.env.local`:

```env
TITAN_EMAIL=gt@guytagger.com
TITAN_PASSWORD=your_titan_password
```

## 3. Local Development

**Start everything:**
```bash
npm start
```

Visit: `http://localhost:4200`

## 4. Production (Vercel)

Add environment variables in Vercel dashboard:
- `TITAN_EMAIL` = `gt@guytagger.com`
- `TITAN_PASSWORD` = Your Titan password

Deploy:
```bash
vercel --prod
```

---

**That's it! Contact form sends emails via Titan SMTP.**

## Step 5: Deploy to Vercel

```bash
vercel --prod
```

Or push to GitHub - Vercel will auto-deploy!

## ✅ You're Done!

Your portfolio now has professional email functionality:
- ✉️ Clients get automatic confirmation emails
- 📧 You get notified at gt@guytagger.com
- 🎨 Beautiful HTML email templates
- ⚡ Serverless, scalable architecture

## 📚 Full Documentation

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed configuration and troubleshooting.

---

**Need Help?** Check the [Resend docs](https://resend.com/docs) or contact support.

