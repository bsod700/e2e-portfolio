import { Injectable, inject } from '@angular/core';
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
  private disposableEmailDomains: string[] = [...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS];

  private readonly emailDomainService = inject(EmailDomainService);

  constructor() {
    this.hydrateDisposableDomainsFromDatabase();
  }

  // Email regex pattern
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone regex pattern (allows digits, spaces, dashes, parentheses, and +)
  private readonly PHONE_REGEX = /^[\d\s\-+()]+$/;

  /**
   * Validate name field
   * - Must not contain numbers
   * - Can be empty (optional field)
   */
  validateName(name: string): ValidationResult {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return { isValid: true, errorMessage: '' };
    }

    if (/\d/.test(trimmedName)) {
      return { isValid: false, errorMessage: 'Name must not contain numbers' };
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

    // Check for disposable email domains
    const emailDomain = trimmedEmail.split('@')[1]?.toLowerCase();
    if (emailDomain && this.disposableEmailDomains.includes(emailDomain)) {
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
   * - Can be empty (optional field)
   */
  validatePhone(phone: string): ValidationResult {
    const trimmedPhone = phone.trim();
    
    if (!trimmedPhone) {
      return { isValid: true, errorMessage: '' };
    }

    if (!this.PHONE_REGEX.test(trimmedPhone)) {
      return { isValid: false, errorMessage: 'Phone number must contain only digits and dashes' };
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
   */
  private hydrateDisposableDomainsFromDatabase(): void {
    this.emailDomainService.getDisposableEmailDomains().subscribe({
      next: (domains) => {
        if (Array.isArray(domains) && domains.length > 0) {
          this.disposableEmailDomains = domains;
        } else {
          this.disposableEmailDomains = [...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS];
        }
      },
      error: () => {
        this.disposableEmailDomains = [...ValidationService.FALLBACK_DISPOSABLE_EMAIL_DOMAINS];
      }
    });
  }
}

