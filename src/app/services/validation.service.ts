import { Injectable, inject, signal, afterNextRender } from '@angular/core';
import { EmailDomainService } from './email-domain.service';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  // Fallback disposable email domains to block (used when DB is unavailable)
  private static readonly FALLBACK_DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'fff.com',
    'test.com',
    'example.com',
    'fake.com'
  ];

  // Runtime list of disposable domains, hydrated from Supabase when available
  // Using signal for reactive state management (Angular 20 best practice)
  private readonly disposableEmailDomains = signal<string[]>([...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS]);
  private isLoadingDomains = signal<boolean>(false);
  private hasAttemptedLoad = false;

  private readonly emailDomainService = inject(EmailDomainService);

  constructor() {
    // Defer API call until after initial render and during idle time
    // This is an Angular 20 best practice for non-critical data loading
    // Uses requestIdleCallback for optimal performance (falls back to setTimeout)
    afterNextRender(() => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          this.hydrateDisposableDomainsFromDatabase();
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback support
        setTimeout(() => {
          this.hydrateDisposableDomainsFromDatabase();
        }, 0);
      }
    });
  }

  // Email regex pattern - validates proper email format
  private readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Phone regex pattern - validates international phone format
  // Allows: +, digits, spaces, dashes, parentheses
  // Must have at least 7 digits (minimum for valid phone numbers)
  private readonly PHONE_REGEX = /^[\+]?[\d\s\-()]{7,}$/;

  /**
   * Validate name field
   * - Must contain only letters, spaces, hyphens, and apostrophes
   * - Must be between 2-50 characters
   * - Can be empty (optional field)
   */
  validateName(name: string): ValidationResult {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return { isValid: true, errorMessage: '' };
    }

    // Check length
    if (trimmedName.length < 2) {
      return { isValid: false, errorMessage: 'Name must be at least 2 characters' };
    }

    if (trimmedName.length > 50) {
      return { isValid: false, errorMessage: 'Name must be less than 50 characters' };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    // Allows: letters (including accented), spaces, hyphens, apostrophes
    if (!/^[\p{L}\s'-]+$/u.test(trimmedName)) {
      return { isValid: false, errorMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    // Check for consecutive special characters
    if (/['-]{2,}/.test(trimmedName)) {
      return { isValid: false, errorMessage: 'Name cannot have consecutive special characters' };
    }

    // Check if name starts/ends with special characters
    if (/^['-]|['-]$/.test(trimmedName)) {
      return { isValid: false, errorMessage: 'Name cannot start or end with special characters' };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Validate email field
   * - Must match email format
   * - Must not be from disposable email domains
   * - Can be empty (optional field)
   */
  validateEmail(email: string): ValidationResult {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return { isValid: true, errorMessage: '' };
    }

    // Check basic email format
    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      return { isValid: false, errorMessage: 'Please enter a valid email address' };
    }

    // Lazy load domains if not already loaded (triggers only when validation is actually needed)
    if (!this.hasAttemptedLoad && !this.isLoadingDomains()) {
      this.hydrateDisposableDomainsFromDatabase();
    }

    // Check for disposable email domains using signal value
    const emailDomain = trimmedEmail.split('@')[1]?.toLowerCase();
    if (emailDomain && this.disposableEmailDomains().includes(emailDomain)) {
      return { 
        isValid: false, 
        errorMessage: 'Please use a valid business or personal email address' 
      };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Validate phone field
   * - Must contain only digits, spaces, dashes, parentheses, and +
   * - Must have at least 7 digits (minimum for valid phone numbers)
   * - Must have at most 15 digits (E.164 standard maximum)
   * - Can be empty (optional field)
   */
  validatePhone(phone: string): ValidationResult {
    const trimmedPhone = phone.trim();
    
    if (!trimmedPhone) {
      return { isValid: true, errorMessage: '' };
    }

    // Check format (allows +, digits, spaces, dashes, parentheses)
    if (!this.PHONE_REGEX.test(trimmedPhone)) {
      return { isValid: false, errorMessage: 'Phone number must contain only digits, spaces, dashes, parentheses, and +' };
    }

    // Extract digits only for validation
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    
    // Check minimum length (at least 7 digits)
    if (digitsOnly.length < 7) {
      return { isValid: false, errorMessage: 'Phone number must have at least 7 digits' };
    }

    // Check maximum length (E.164 standard: max 15 digits)
    if (digitsOnly.length > 15) {
      return { isValid: false, errorMessage: 'Phone number cannot exceed 15 digits' };
    }

    // Check if it starts with + (international format)
    if (trimmedPhone.includes('+') && !trimmedPhone.startsWith('+')) {
      return { isValid: false, errorMessage: 'Plus sign (+) must be at the beginning for international numbers' };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Check if at least one contact method is provided
   */
  hasAtLeastOneContactMethod(name: string, email: string, phone: string): boolean {
    return !!(name.trim() || email.trim() || phone.trim());
  }

  /**
   * Attempt to hydrate the disposable domain list from Supabase.
   * If anything fails, the service silently falls back to the hardcoded list.
   * Uses caching to prevent multiple simultaneous API calls.
   */
  private hydrateDisposableDomainsFromDatabase(): void {
    // Prevent multiple simultaneous API calls
    if (this.isLoadingDomains() || this.hasAttemptedLoad) {
      return;
    }

    this.hasAttemptedLoad = true;
    this.isLoadingDomains.set(true);

    this.emailDomainService.getDisposableEmailDomains().subscribe({
      next: (domains) => {
        if (Array.isArray(domains) && domains.length > 0) {
          this.disposableEmailDomains.set(domains);
        } else {
          this.disposableEmailDomains.set([...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS]);
        }
        this.isLoadingDomains.set(false);
      },
      error: () => {
        this.disposableEmailDomains.set([...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS]);
        this.isLoadingDomains.set(false);
      }
    });
  }
}

