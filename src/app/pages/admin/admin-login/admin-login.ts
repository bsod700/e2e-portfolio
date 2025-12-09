import { Component, OnInit, inject, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  // Centralised route configuration to avoid magic strings
  private readonly adminRoute = ['/admin'];

  email = ''; // Pre-fill with allowed email
  password = '';
  useMagicLink = false;
  loading = false;
  error = '';
  successMessage = '';

  constructor() {
    // Use effect to reactively handle authentication state changes
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(this.adminRoute);
      }
    });
  }

  ngOnInit(): void {
    // Check for success message in query params
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.successMessage = params['message'];
      }
    });

    // Check if user is already authenticated (signals are synchronous)
    if (this.authService.isAuthenticated()) {
      this.router.navigate(this.adminRoute);
    }

    // Also check for auth callback in URL
    this.checkAuthCallback();
  }

  private async checkAuthCallback(): Promise<void> {
    // Only run in browser (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Small delay to allow auth service to process callback
    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(this.adminRoute);
      }
    }, 500);
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    try {
      if (this.useMagicLink) {
        const result = await this.authService.signInWithMagicLink(this.email);

        if (result.success) {
          this.successMessage = result.message || 'Magic link sent! Check your email.';
        } else {
          this.error = result.error || 'Failed to send magic link';
        }
      } else {
        const result = await this.authService.signInWithEmail(this.email, this.password);

        if (result.success) {
          this.router.navigate(this.adminRoute);
        } else {
          this.error = result.error || 'Failed to sign in';
        }
      }
    } catch (err) {
      // Fallback error handling for unexpected failures
      this.error = 'An unexpected error occurred while signing in. Please try again.';
      // Optionally log the error somewhere (e.g. monitoring service)
      console.error('AdminLoginComponent.onSubmit error', err);
    } finally {
      this.loading = false;
    }
  }

  toggleAuthMethod(): void {
    this.useMagicLink = !this.useMagicLink;
    this.error = '';
    this.successMessage = '';
  }

  async checkAuthStatus(): Promise<void> {
    this.loading = true;
    this.error = '';
    
    // Signals are synchronous - no need for subscribe
    if (this.authService.isAuthenticated()) {
      this.successMessage = 'You are signed in! Redirecting...';
      setTimeout(() => {
        this.router.navigate(this.adminRoute);
      }, 500);
    } else {
      this.error = 'You are not signed in. Please use magic link or password to sign in.';
    }
    
    this.loading = false;
  }

  async requestPasswordReset(): Promise<void> {
    if (!this.email) {
      this.error = 'Please enter your email address first';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    try {
      const result = await this.authService.resetPassword(this.email);

      if (result.success) {
        this.successMessage = result.message || 'Password reset email sent! Check your email for instructions.';
      } else {
        this.error = result.error || 'Failed to send password reset email';
      }
    } catch (err) {
      this.error = 'An unexpected error occurred while requesting a password reset. Please try again.';
      console.error('AdminLoginComponent.requestPasswordReset error', err);
    } finally {
      this.loading = false;
    }
  }
}

