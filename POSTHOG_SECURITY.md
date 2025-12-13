# PostHog Security & Environment Configuration

## Overview

This document covers security best practices for PostHog integration in your Angular application.

## Environment Configuration

PostHog credentials are configured in Angular environment files, **NOT** in `.env` files. This is the Angular best practice.

### Configuration Files

```
src/environments/
  ├── environment.ts          # Development configuration
  └── environment.prod.ts     # Production configuration
```

### Why Environment Files Instead of .env?

1. **Angular Specific**: Angular uses environment files for build-time configuration
2. **Type Safety**: TypeScript provides compile-time type checking
3. **Build Optimization**: Angular CLI can tree-shake unused code based on environment
4. **SSR Compatible**: Works with both client and server-side rendering

## Security Best Practices

### ✅ Safe Practices

1. **PostHog Public Keys Are Safe to Expose**
   - PostHog project API keys (starting with `phc_`) are designed to be public
   - They can be safely committed to git and exposed in client-side code
   - They only allow data ingestion, not data extraction

2. **Environment-Specific Configuration**
   ```typescript
   // environment.ts (Development)
   export const environment = {
     production: false,
     posthog: {
       key: 'phc_YOUR_DEV_KEY',
       host: 'https://eu.i.posthog.com'
     }
   };

   // environment.prod.ts (Production)
   export const environment = {
     production: true,
     posthog: {
       key: 'phc_YOUR_PROD_KEY',
       host: 'https://eu.i.posthog.com'
     }
   };
   ```

3. **Browser-Only Initialization**
   - PostHog only initializes in the browser (not during SSR)
   - Prevents server-side tracking and potential issues

4. **Secure Cookie Settings**
   - Automatically enabled in production
   - Ensures cookies are transmitted over HTTPS only

5. **User Privacy Controls**
   - Opt-in/opt-out functionality included
   - GDPR and privacy law compliant

### ❌ Common Mistakes to Avoid

1. **Don't Use `process.env` in Angular**
   ```typescript
   // ❌ WRONG - Won't work in browser
   posthog.init(process.env.POSTHOG_KEY, {...});

   // ✅ CORRECT - Use Angular environment
   import { environment } from './environments/environment';
   posthog.init(environment.posthog.key, {...});
   ```

2. **Don't Store Personal Admin Keys**
   - Never commit PostHog **personal API keys** (used for API access)
   - Only project keys (public keys) should be in environment files

3. **Don't Track Sensitive Data**
   ```typescript
   // ❌ WRONG - Don't track passwords, tokens, etc.
   this.posthog.captureEvent('login', { 
     password: user.password  // NEVER DO THIS
   });

   // ✅ CORRECT - Only track non-sensitive metadata
   this.posthog.captureEvent('login', { 
     method: 'email',
     timestamp: new Date()
   });
   ```

## What Keys Are Safe to Commit?

### ✅ SAFE to commit:
- PostHog Project API Key (`phc_...`)
- Supabase Anon Key (for client-side)
- PostHog Host URL

### ❌ NEVER commit:
- PostHog Personal API Keys
- Supabase Service Role Key
- Database passwords
- Email API keys
- Private API tokens

## Privacy Compliance

### GDPR Compliance

1. **Cookie Consent**
   ```typescript
   // Wait for user consent before tracking
   onUserConsent() {
     this.posthog.optIn();
   }

   onUserReject() {
     this.posthog.optOut();
   }
   ```

2. **Data Minimization**
   - Only track necessary events
   - Avoid collecting PII (Personally Identifiable Information)
   - Use anonymous IDs when possible

3. **Right to be Forgotten**
   ```typescript
   // When user requests data deletion
   onDeleteUserData(userId: string) {
     this.posthog.reset();
     // Also request deletion from PostHog dashboard
   }
   ```

### Session Recording Privacy

```typescript
// In posthog.service.ts configuration:
{
  disable_session_recording: false, // Enable/disable recordings
  mask_all_text: false,             // Mask sensitive text
  mask_all_element_attributes: false, // Mask element attributes
}
```

**Recommended Settings:**
- For public websites: `mask_all_text: false`
- For apps with PII: `mask_all_text: true`
- For forms with sensitive data: Add `ph-no-capture` class to elements

```html
<!-- Prevent PostHog from capturing this element -->
<input type="password" class="ph-no-capture" />
<div class="ph-no-capture">Sensitive content here</div>
```

## Production Checklist

Before deploying to production:

- [ ] Verify production PostHog key is set in `environment.prod.ts`
- [ ] Confirm secure cookies are enabled (automatic in production)
- [ ] Implement cookie consent banner if required by law
- [ ] Review all tracked events for sensitive data
- [ ] Add `ph-no-capture` class to sensitive form fields
- [ ] Test opt-out functionality
- [ ] Document what data you collect in Privacy Policy
- [ ] Set up data retention policies in PostHog dashboard

## Troubleshooting

### PostHog Not Tracking

1. **Check Browser Console**
   ```bash
   # Should see in development:
   "PostHog initialized successfully"
   ```

2. **Verify Environment**
   ```typescript
   // Add temporary debug log
   console.log('PostHog config:', environment.posthog);
   ```

3. **Check Network Tab**
   - Look for requests to PostHog host
   - Verify they're not blocked by ad blockers

### Common Errors

**Error: `process.env is not defined`**
- Solution: Import from `environment` files, not `process.env`

**Error: `Cannot read properties of undefined`**
- Solution: Check that PostHog key exists in environment file

**Warning: `PostHog key not found`**
- Solution: Add PostHog configuration to environment file

## Additional Security Resources

- [PostHog Security Overview](https://posthog.com/docs/privacy)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [GDPR Compliance Guide](https://posthog.com/docs/privacy/gdpr-compliance)
- [Data Protection Best Practices](https://posthog.com/docs/privacy/data-protection)

## Support

If you encounter security issues or have questions:
1. Check PostHog documentation
2. Review this security guide
3. Contact PostHog support for sensitive security matters
