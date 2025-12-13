import { Injectable } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

/**
 * PostHog Analytics Service
 * Provides a safe wrapper around PostHog analytics functionality
 */
@Injectable({
  providedIn: 'root'
})
export class PostHogService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize PostHog if running in browser environment
   */
  private initialize(): void {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Only initialize if we have a valid key
    if (!environment.posthog.key) {
      console.warn('PostHog key not found in environment configuration');
      return;
    }

    try {
      posthog.init(environment.posthog.key, {
        api_host: environment.posthog.host,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        // Security and privacy settings
        secure_cookie: environment.production,
        persistence: 'localStorage',
        disable_session_recording: false, // Set to true if you want to disable session recordings
        mask_all_text: false, // Set to true to mask all text in recordings
        mask_all_element_attributes: false,
        // Performance settings
        loaded: (posthog) => {
          this.isInitialized = true;
          if (!environment.production) {
            console.log('PostHog initialized successfully');
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }

  /**
   * Track a custom event
   */
  captureEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error('Failed to capture PostHog event:', error);
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.identify(userId, properties);
    } catch (error) {
      console.error('Failed to identify user in PostHog:', error);
    }
  }

  /**
   * Reset the user session (e.g., on logout)
   */
  reset(): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.reset();
    } catch (error) {
      console.error('Failed to reset PostHog:', error);
    }
  }

  /**
   * Set person properties
   */
  setPersonProperties(properties: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.people.set(properties);
    } catch (error) {
      console.error('Failed to set person properties in PostHog:', error);
    }
  }

  /**
   * Get the current distinct ID
   */
  getDistinctId(): string | null {
    if (!this.isInitialized || typeof window === 'undefined') {
      return null;
    }

    try {
      return posthog.get_distinct_id();
    } catch (error) {
      console.error('Failed to get distinct ID from PostHog:', error);
      return null;
    }
  }

  /**
   * Check if PostHog is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Enable or disable PostHog tracking
   */
  optIn(): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.opt_in_capturing();
    } catch (error) {
      console.error('Failed to opt in to PostHog:', error);
    }
  }

  /**
   * Disable PostHog tracking
   */
  optOut(): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      posthog.opt_out_capturing();
    } catch (error) {
      console.error('Failed to opt out of PostHog:', error);
    }
  }
}
