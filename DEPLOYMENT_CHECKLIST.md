# 🚀 Deployment Checklist

Before deploying, make sure you have:

## ✅ Environment Variables in Vercel

Go to your Vercel dashboard → Settings → Environment Variables

Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `TITAN_EMAIL` | `gt@guytagger.com` | Your Titan email |
| `TITAN_PASSWORD` | Your password | Keep this secret! |

**Important:** Select all environments (Production, Preview, Development)

## ✅ Test Locally First

Before deploying to production:

```bash
# 1. Create .env.local with your credentials
echo 'TITAN_EMAIL=gt@guytagger.com
TITAN_PASSWORD=your_password' > .env.local

# 2. Test locally
vercel dev

# 3. Visit http://localhost:3000
# 4. Submit the contact form
# 5. Check browser console for errors
# 6. Check your email inbox
```

## ✅ Deploy

```bash
vercel --prod
```

## 🐛 Troubleshooting Production Errors

### Error 500: Internal Server Error

**Most common causes:**

1. **Missing Environment Variables**
   - Go to Vercel dashboard
   - Check Settings → Environment Variables
   - Make sure `TITAN_EMAIL` and `TITAN_PASSWORD` are set

2. **Wrong Titan Password**
   - Try logging into Titan webmail to verify password
   - Update the password in Vercel if changed

3. **SMTP Connection Issues**
   - Titan SMTP might be blocking the connection
   - Check Vercel function logs for details

### Check Vercel Logs

```bash
# View real-time logs
vercel logs

# Or check in dashboard:
# Project → Deployments → Click deployment → Functions tab
```

### Test API Endpoint Directly

```bash
curl -X POST https://your-domain.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Test",
    "contactEmail": "test@example.com",
    "contactPhone": "",
    "message": "Test message"
  }'
```

Look for detailed error in response.

## 📧 Common SMTP Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid login` | Wrong credentials | Check Titan password |
| `Connection timeout` | SMTP port blocked | Contact Vercel support |
| `EAUTH` | Authentication failed | Verify email & password |
| `ESOCKET` | Network issue | Check Titan status |

## 🔐 Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use environment variables for secrets
- ✅ Rotate passwords regularly
- ✅ Check Vercel audit logs

## 📞 Need Help?

1. Check Vercel function logs
2. Test with curl command above
3. Verify environment variables are set
4. Try redeploying after fixing env vars

---

**After fixing environment variables, redeploy:**

```bash
vercel --prod --force
```

