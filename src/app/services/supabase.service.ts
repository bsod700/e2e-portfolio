import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

// Global singleton to prevent multiple client instances
let globalSupabaseClient: SupabaseClient | null = null;
let clientInitializationInProgress = false;

/**
 * No-op lock function to disable Navigator LockManager
 * This prevents NavigatorLockAcquireTimeoutError errors
 */
const noOpLock = async <T>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<T>
): Promise<T> => {
  // Simply execute the function without any locking mechanism
  return fn();
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Initialize client only once, lazily (both browser and server)
    if (!globalSupabaseClient && !clientInitializationInProgress) {
      this.initializeClient();
    }
  }

  private initializeClient(): void {
    if (globalSupabaseClient || clientInitializationInProgress) {
      return;
    }

    if (!environment.supabase.anonKey || !environment.supabase.url) {
      return;
    }

    try {
      clientInitializationInProgress = true;

      if (isPlatformBrowser(this.platformId)) {
        // Browser initialization with auth features
        globalSupabaseClient = createClient(environment.supabase.url, environment.supabase.anonKey, {
          auth: {
            lock: noOpLock, // Disable lock mechanism to prevent NavigatorLockAcquireTimeoutError
            storage: this.createSafeStorageAdapter(),
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {}
          }
        });
      } else {
        // Server initialization - minimal config, no auth features
        globalSupabaseClient = createClient(environment.supabase.url, environment.supabase.anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          },
          global: {
            headers: {}
          }
        });
      }
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      // If initialization fails, try with minimal config
      try {
        globalSupabaseClient = createClient(environment.supabase.url, environment.supabase.anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
      } catch (fallbackError) {
        console.error('Error in fallback Supabase client initialization:', fallbackError);
      }
    } finally {
      clientInitializationInProgress = false;
    }
  }

  /**
   * Creates a safe storage adapter that handles Navigator LockManager errors gracefully
   */
  private createSafeStorageAdapter() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }

    return {
      getItem: (key: string): string | null => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.warn('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string): void => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.warn('Error writing to localStorage:', error);
        }
      },
      removeItem: (key: string): void => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.warn('Error removing from localStorage:', error);
        }
      }
    };
  }

  get client(): SupabaseClient | null {
    // Ensure client is initialized if it hasn't been yet (both browser and server)
    if (!globalSupabaseClient) {
      this.initializeClient();
    }
    return globalSupabaseClient;
  }
}

