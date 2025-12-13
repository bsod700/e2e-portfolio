# PostHog Analytics Integration

This document explains how to use PostHog analytics in your Angular application following best practices.

## Overview

PostHog is integrated via a dedicated service (`PostHogService`) that provides a safe, type-safe wrapper around PostHog functionality.

## Configuration

PostHog credentials are configured in environment files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false,
  posthog: {
    key: 'phc_YOUR_KEY_HERE',
    host: 'https://eu.i.posthog.com'
  }
};
```

### Security Best Practices

✅ **DO:**
- Store PostHog keys in environment files (already done)
- Use different keys for development/production if needed
- PostHog public keys are safe to expose in client-side code
- Enable secure cookies in production (automatically configured)

❌ **DON'T:**
- Never commit sensitive private API keys to git
- Don't use `process.env` in Angular (it's Node.js only)
- Avoid storing personal data without user consent

## Usage in Components

### Basic Event Tracking

```typescript
import { Component, inject } from '@angular/core';
import { PostHogService } from './services/posthog.service';

@Component({
  selector: 'app-example',
  template: `<button (click)="trackClick()">Track Me</button>`
})
export class ExampleComponent {
  private posthog = inject(PostHogService);

  trackClick() {
    this.posthog.captureEvent('button_clicked', {
      button_name: 'example_button',
      timestamp: new Date().toISOString()
    });
  }
}
```

### User Identification

When a user logs in or signs up:

```typescript
import { Component, inject } from '@angular/core';
import { PostHogService } from './services/posthog.service';

@Component({
  selector: 'app-auth'
})
export class AuthComponent {
  private posthog = inject(PostHogService);

  onUserLogin(user: User) {
    // Identify the user
    this.posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      plan: user.subscriptionPlan
    });
  }

  onUserLogout() {
    // Reset the session
    this.posthog.reset();
  }
}
```

### Page View Tracking

Page views are automatically tracked by PostHog. However, you can manually track custom page views:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PostHogService } from './services/posthog.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root'
})
export class AppComponent implements OnInit {
  private posthog = inject(PostHogService);
  private router = inject(Router);

  ngOnInit() {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.posthog.captureEvent('$pageview', {
        path: event.urlAfterRedirects
      });
    });
  }
}
```

### Set User Properties

```typescript
setUserProperties() {
  this.posthog.setPersonProperties({
    preferred_language: 'en',
    theme: 'dark',
    last_active: new Date().toISOString()
  });
}
```

### Privacy Compliance

Implement opt-in/opt-out for GDPR compliance:

```typescript
import { Component, inject } from '@angular/core';
import { PostHogService } from './services/posthog.service';

@Component({
  selector: 'app-privacy-settings'
})
export class PrivacySettingsComponent {
  private posthog = inject(PostHogService);

  enableAnalytics() {
    this.posthog.optIn();
  }

  disableAnalytics() {
    this.posthog.optOut();
  }
}
```

## Common Use Cases

### 1. Form Submission Tracking

```typescript
onFormSubmit(formName: string) {
  this.posthog.captureEvent('form_submitted', {
    form_name: formName,
    timestamp: new Date().toISOString()
  });
}
```

### 2. Feature Usage Tracking

```typescript
onFeatureUsed(featureName: string) {
  this.posthog.captureEvent('feature_used', {
    feature: featureName,
    user_id: this.currentUserId
  });
}
```

### 3. Error Tracking

```typescript
onError(error: Error) {
  this.posthog.captureEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    page: window.location.pathname
  });
}
```

### 4. E-commerce Events

```typescript
onProductView(product: Product) {
  this.posthog.captureEvent('product_viewed', {
    product_id: product.id,
    product_name: product.name,
    price: product.price
  });
}

onPurchase(order: Order) {
  this.posthog.captureEvent('purchase_completed', {
    order_id: order.id,
    total_amount: order.total,
    items_count: order.items.length
  });
}
```

## Service Methods Reference

| Method | Description |
|--------|-------------|
| `captureEvent(name, properties?)` | Track a custom event |
| `identify(userId, properties?)` | Identify a user |
| `reset()` | Clear user session (logout) |
| `setPersonProperties(properties)` | Set user properties |
| `getDistinctId()` | Get current user's distinct ID |
| `isReady()` | Check if PostHog is initialized |
| `optIn()` | Enable tracking |
| `optOut()` | Disable tracking |

## Testing

PostHog service gracefully handles:
- Server-side rendering (SSR) - doesn't initialize on server
- Missing configuration - logs warning but doesn't crash
- Network failures - catches and logs errors

## Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Angular Integration](https://posthog.com/docs/libraries/angular)
- [GDPR Compliance](https://posthog.com/docs/privacy)
