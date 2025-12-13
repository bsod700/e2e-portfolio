import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { PostHogService } from './services/posthog.service';

/**
 * Initialize PostHog service on app startup
 */
export function initializePostHog(posthogService: PostHogService) {
  return () => {
    // Service initialization happens in constructor
    // This ensures it's initialized before the app starts
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true 
    }),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withComponentInputBinding()
    ),
    provideClientHydration(withEventReplay()),
    // Initialize PostHog service
    {
      provide: APP_INITIALIZER,
      useFactory: initializePostHog,
      deps: [PostHogService],
      multi: true
    }
  ]
};
