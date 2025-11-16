import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// Type definitions for better type safety
interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface AuthCallbackParams {
  accessToken?: string | null;
  error?: string | null;
  type?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  
  // Signal-based state management (modern Angular approach)
  private readonly currentUserSignal = signal<User | null>(null);
  
  // Public computed signals for components
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => {
    const user = this.currentUserSignal();
    return user !== null && this.isAuthorizedUser(user);
  });
  
  // Security: Only allow this specific email
  private readonly ALLOWED_EMAIL = 'guytagger@gmail.com';
  private readonly ADMIN_ROUTE = '/admin';
  private readonly LOGIN_ROUTE = '/admin/login';
  private readonly RESET_PASSWORD_ROUTE = '/admin/reset-password';

  constructor() {
    this.initialize();
  }

  /**
   * Initialize authentication state and set up listeners
   */
  private async initialize(): Promise<void> {
    const client = this.getClient();
    if (!client) return;

    // Check for auth callback first (before checking existing session)
    // This ensures password reset tokens are processed
    await this.handleAuthCallback();
    
    await this.checkExistingSession(client);
    this.setupAuthStateListener(client);
  }

  /**
   * Check if there's an existing valid session
   */
  private async checkExistingSession(client: any): Promise<void> {
    const { data: { session } } = await client.auth.getSession();
    
    if (session?.user) {
      const isAuthorized = await this.isAuthorizedUserAsync(session.user);
      if (isAuthorized) {
        this.currentUserSignal.set(session.user);
      } else {
        await this.handleUnauthorizedUser(session.user.email);
      }
    }
  }

  /**
   * Set up listener for auth state changes
   */
  private setupAuthStateListener(client: any): void {
    client.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        const isAuthorized = await this.isAuthorizedUserAsync(session.user);
        if (isAuthorized) {
          this.currentUserSignal.set(session.user);
        } else {
          await this.handleUnauthorizedUser(session.user.email);
        }
      } else {
        this.currentUserSignal.set(null);
      }
    });
  }

  /**
   * Handle authentication callback from magic links
   * Only processes callbacks on pages that should auto-redirect (not setup-password or reset-password)
   */
  private async handleAuthCallback(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Skip callback processing on pages that handle their own auth flow
    const currentPath = window.location.pathname;
    if (currentPath.includes('/setup-password') || currentPath.includes('/reset-password')) {
      return; // Let those pages handle their own callbacks
    }

    const params = this.extractCallbackParams();
    
    if (params.error) {
      this.handleCallbackError(params.error);
      return;
    }

    if (this.isMagicLinkCallback(params)) {
      await this.processMagicLinkCallback();
    }
  }

  /**
   * Extract callback parameters from URL
   */
  private extractCallbackParams(): AuthCallbackParams {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    return {
      accessToken: hashParams.get('access_token') || queryParams.get('access_token'),
      error: hashParams.get('error') || queryParams.get('error'),
      type: hashParams.get('type') || queryParams.get('type')
    };
  }

  /**
   * Check if this is a magic link or recovery callback
   */
  private isMagicLinkCallback(params: AuthCallbackParams): boolean {
    return params.type === 'magiclink' || params.type === 'recovery' || !!params.accessToken;
  }

  /**
   * Process magic link callback and redirect to admin
   */
  private async processMagicLinkCallback(): Promise<void> {
    const client = this.getClient();
    if (!client) return;

    try {
      // Wait for Supabase to process the token
      await this.delay(200);
      
      const session = await this.getSession(client);
      if (!session) {
        // Retry once more after a longer delay
        await this.delay(500);
        const retrySession = await this.getSession(client);
        if (!retrySession) return;
        
        const isAuthorized = await this.isAuthorizedUserAsync(retrySession.user);
        if (isAuthorized) {
          this.currentUserSignal.set(retrySession.user);
          this.cleanupUrlAndRedirect(this.ADMIN_ROUTE);
        } else {
          await this.handleUnauthorizedUser(retrySession.user.email);
        }
        return;
      }

      const isAuthorized = await this.isAuthorizedUserAsync(session.user);
      if (isAuthorized) {
        this.currentUserSignal.set(session.user);
        this.cleanupUrlAndRedirect(this.ADMIN_ROUTE);
      } else {
        await this.handleUnauthorizedUser(session.user.email);
      }
    } catch (error: any) {
      // Suppress lock timeout errors - they're usually harmless
      if (error?.message?.includes('NavigatorLockAcquireTimeoutError')) {
        console.warn('[Auth] Lock timeout (usually harmless):', error.message);
        return;
      }
      console.error('Error processing magic link callback:', error);
    }
  }

  /**
   * Get current session from Supabase
   */
  private async getSession(client: any, retryDelay?: number): Promise<any> {
    try {
      const { data: { session }, error } = await client.auth.getSession();
      
      if (error) {
        // Suppress lock timeout errors - they're usually harmless
        if (error.message?.includes('NavigatorLockAcquireTimeoutError')) {
          console.warn('[Auth] Lock timeout (usually harmless):', error.message);
          // Retry after a short delay
          await this.delay(300);
          const retry = await client.auth.getSession();
          return retry.data?.session || null;
        }
        console.error('Session error:', error);
        return null;
      }

      // Retry logic for callback scenarios
      if (!session && retryDelay) {
        await this.delay(retryDelay);
        return this.getSession(client);
      }

      return session;
    } catch (error: any) {
      // Suppress lock timeout errors
      if (error?.message?.includes('NavigatorLockAcquireTimeoutError')) {
        console.warn('[Auth] Lock timeout (usually harmless):', error.message);
        return null;
      }
      console.error('[Auth] Exception getting session:', error);
      return null;
    }
  }

  /**
   * Handle unauthorized user - sign out immediately
   */
  private async handleUnauthorizedUser(email: string | undefined): Promise<void> {
    console.warn('Unauthorized email detected, signing out:', email);
    await this.signOut();
    this.currentUserSignal.set(null);
  }

  /**
   * Handle callback errors
   */
  private handleCallbackError(error: string): void {
    console.error('Auth callback error:', error);
    this.cleanupUrl();
  }

  /**
   * Clean up URL parameters and optionally redirect
   */
  private cleanupUrlAndRedirect(route: string): void {
    this.cleanupUrl();
    setTimeout(() => {
      this.router.navigate([route], { replaceUrl: true });
    }, 100);
  }

  /**
   * Remove auth parameters from URL
   */
  private cleanupUrl(): void {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const client = this.getClient();
    if (!client) {
      return this.createErrorResult('Supabase client not initialized');
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({ 
        email: this.normalizeEmail(email), 
        password 
      });

      if (error) {
        // Provide more helpful error messages
        if (error.message?.includes('Invalid login credentials') || error.message?.includes('400')) {
          return this.createErrorResult(
            'Invalid email or password. If you only used magic link before, you need to set a password first. Use the "Change Password" option in Settings or request a password reset email.'
          );
        }
        return this.createErrorResult(error.message);
      }

      // Check authorization (async check for admin_users table)
      const isAuthorized = await this.isAuthorizedUserAsync(data.user);
      if (!isAuthorized) {
        await this.signOut();
        return this.createErrorResult('Access denied. Only authorized admin users can access this area.');
      }

      return this.createSuccessResult();
    } catch (error: any) {
      return this.createErrorResult(error.message || 'An error occurred during sign in');
    }
  }

  /**
   * Sign in with magic link (OTP)
   * Only works for the hardcoded email - other users must use password login
   */
  async signInWithMagicLink(email: string): Promise<AuthResult> {
    const client = this.getClient();
    if (!client) {
      return this.createErrorResult('Supabase client not initialized');
    }

    // Magic link ONLY works for the hardcoded email
    if (!this.isAllowedEmail(email)) {
      return this.createErrorResult(
        `Magic link is only available for ${this.ALLOWED_EMAIL}. Please use password login instead.`
      );
    }

    try {
      const redirectUrl = this.buildRedirectUrl(this.ADMIN_ROUTE);
      
      this.logAuthEnvironment(redirectUrl);
      
      const { error } = await client.auth.signInWithOtp({
        email: this.normalizeEmail(email),
        options: { emailRedirectTo: redirectUrl }
      });

      if (error) {
        if (this.isRateLimitError(error)) {
          return this.createErrorResult(
            'Too many requests. Please wait a few minutes before requesting another magic link.'
          );
        }
        return this.createErrorResult(error.message);
      }

      return this.createSuccessResult(
        `Magic link sent to ${this.ALLOWED_EMAIL}. Check your email to sign in.`
      );
    } catch (error: any) {
      return this.createErrorResult(error.message || 'An error occurred sending magic link');
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const client = this.getClient();
    if (client) {
      await client.auth.signOut();
    }
    this.currentUserSignal.set(null);
    this.router.navigate([this.LOGIN_ROUTE]);
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    const client = this.getClient();
    if (!client) {
      return this.createErrorResult('Supabase client not initialized');
    }

    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await client.auth.getSession();
      
      if (sessionError || !session) {
        return this.createErrorResult(
          'No active session found. Please use the password reset link from your email to set your password.'
        );
      }

      // Now update the password
      const { error } = await client.auth.updateUser({ password: newPassword });

      if (error) {
        // Provide more helpful error messages
        if (error.message?.includes('session') || error.message?.includes('Auth session missing')) {
          return this.createErrorResult(
            'Session expired. Please use the password reset link from your email again.'
          );
        }
        return this.createErrorResult(error.message);
      }

      return this.createSuccessResult();
    } catch (error: any) {
      if (error?.message?.includes('session') || error?.message?.includes('Auth session missing')) {
        return this.createErrorResult(
          'Session expired. Please use the password reset link from your email again.'
        );
      }
      return this.createErrorResult(error.message || 'An error occurred updating password');
    }
  }

  /**
   * Request password reset email
   */
  async resetPassword(email: string): Promise<AuthResult> {
    const client = this.getClient();
    if (!client) {
      return this.createErrorResult('Supabase client not initialized');
    }

    // Security: Check if email is in admin_users table
    const isAuthorized = this.isAllowedEmail(email) || await this.isEmailInAdminUsers(email);
    if (!isAuthorized) {
      return this.createErrorResult('Access denied. Only authorized admin users can reset password.');
    }

    try {
      const redirectUrl = this.buildRedirectUrl(this.RESET_PASSWORD_ROUTE);
      
      this.logAuthEnvironment(redirectUrl);
      
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        return this.createErrorResult(error.message);
      }

      return this.createSuccessResult('Password reset email sent! Check your email for instructions.');
    } catch (error: any) {
      return this.createErrorResult(error.message || 'An error occurred sending reset email');
    }
  }

  /**
   * Get current user synchronously
   * @deprecated Use currentUser signal directly instead
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  // ==================== Helper Methods ====================

  /**
   * Get Supabase client (with null check)
   */
  private getClient() {
    return this.supabaseService.client;
  }

  /**
   * Check if email is allowed (case-insensitive)
   * Checks both hardcoded email and admin_users table
   */
  private isAllowedEmail(email: string): boolean {
    if (!email) return false;
    // Always allow the hardcoded email
    if (this.normalizeEmail(email) === this.normalizeEmail(this.ALLOWED_EMAIL)) {
      return true;
    }
    // For other emails, we'll check the database (async check in isAuthorizedUser)
    return false;
  }

  /**
   * Check if email exists in admin_users table (async)
   */
  private async isEmailInAdminUsers(email: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const { data, error } = await client
        .from('admin_users')
        .select('email')
        .eq('email', this.normalizeEmail(email))
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is authorized
   * Checks hardcoded email first, then admin_users table
   */
  private isAuthorizedUser(user: User | null | undefined): boolean {
    if (!user?.email) return false;
    // Quick check for hardcoded email
    if (this.isAllowedEmail(user.email)) {
      return true;
    }
    // For other emails, we need async check - but this is sync method
    // So we'll do a synchronous check that might need async verification
    // The actual async check will happen in sign-in methods
    return false;
  }

  /**
   * Check if user is authorized (async version for database check)
   */
  private async isAuthorizedUserAsync(user: User | null | undefined): Promise<boolean> {
    if (!user?.email) return false;
    
    // Check hardcoded email first
    if (this.isAllowedEmail(user.email)) {
      return true;
    }

    // Check admin_users table
    return await this.isEmailInAdminUsers(user.email);
  }

  /**
   * Normalize email for comparison (trim and lowercase)
   */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Build redirect URL for auth flows
   */
  private buildRedirectUrl(route: string): string {
    const baseUrl = this.getBaseUrl();
    return `${baseUrl}${route}`;
  }

  /**
   * Get base URL for redirects (prefers environment.siteUrl)
   */
  private getBaseUrl(): string {
    if (environment.siteUrl?.trim()) {
      return environment.siteUrl;
    }
    
    const fallbackUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    if (environment.production) {
      console.error('[Auth] ERROR: environment.siteUrl is not configured in production! Using fallback:', fallbackUrl);
    }
    
    return fallbackUrl;
  }

  /**
   * Check if error is rate limit related
   */
  private isRateLimitError(error: any): boolean {
    return error.message?.includes('429') || error.message?.includes('Too Many Requests');
  }

  /**
   * Create success result
   */
  private createSuccessResult(message?: string): AuthResult {
    return { success: true, ...(message && { message }) };
  }

  /**
   * Create error result
   */
  private createErrorResult(error: string): AuthResult {
    return { success: false, error };
  }

  /**
   * Log auth environment for debugging
   */
  private logAuthEnvironment(redirectUrl: string): void {
    console.log('[Auth] Environment:', {
      production: environment.production,
      siteUrl: environment.siteUrl,
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
      finalRedirectUrl: redirectUrl
    });
  }

  /**
   * Utility: Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
