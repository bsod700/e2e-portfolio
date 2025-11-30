import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  // Disposable email domains to block
  private readonly DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'fff.com',
    'test.com',
    'example.com',
    'fake.com'
  ];

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
    if (emailDomain && this.DISPOSABLE_EMAIL_DOMAINS.includes(emailDomain)) {
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
}

