import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { injectSpeedInsights } from '@vercel/speed-insights';

// Global error handler to catch and suppress Navigator LockManager errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Suppress NavigatorLockAcquireTimeoutError from Supabase
    if (
      event.error?.name === 'NavigatorLockAcquireTimeoutError' ||
      event.message?.includes('NavigatorLockAcquireTimeoutError') ||
      event.message?.includes('lock:sb-')
    ) {
      event.preventDefault();
      console.warn('Supabase lock acquisition timeout (non-critical):', event.message);
    }
  });

  // Also catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (
      error?.name === 'NavigatorLockAcquireTimeoutError' ||
      error?.message?.includes('NavigatorLockAcquireTimeoutError') ||
      error?.message?.includes('lock:sb-')
    ) {
      event.preventDefault();
      console.warn('Supabase lock acquisition timeout (non-critical):', error?.message || event.reason);
    }
  });
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
injectSpeedInsights();
