import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-setup-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-setup-password.html',
  styleUrl: './admin-setup-password.scss'
})
export class AdminSetupPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  password = signal('');
  confirmPassword = signal('');
  settingPassword = signal(false);
  error = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    // Handle auth callback from email link
    this.handleAuthCallback();
  }

  private async handleAuthCallback(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check for access token in URL (from email link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
    const type = hashParams.get('type') || queryParams.get('type');
    const error = hashParams.get('error') || queryParams.get('error');

    // Handle errors
    if (error) {
      this.error.set(`Authentication error: ${error}. Please request a new invitation email.`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // If user came from password reset or magic link, process the token
    if (type === 'recovery' || type === 'magiclink' || accessToken) {
      // Don't clean up URL yet - let Supabase process it first
      // Wait for Supabase to process the token and create session
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check authentication status with retries
      let isAuthenticated = this.authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Retry a few more times - password reset tokens need more time
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          isAuthenticated = this.authService.isAuthenticated();
          if (isAuthenticated) break;
        }
      }

      // Now clean up URL after session is established
      if (accessToken) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (isAuthenticated) {
        this.successMessage.set('Please set your password to complete your account setup.');
      } else {
        this.error.set('Authentication failed. The link may have expired. Please request a new invitation email.');
      }
    } else {
      // No token in URL - check if already authenticated
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.successMessage.set('Please set your password to complete your account setup.');
      } else {
        this.error.set('No authentication token found. Please use the link from your email.');
      }
    }
  }

  async setPassword(): Promise<void> {
    const passwordValue = this.password();
    const confirmPasswordValue = this.confirmPassword();

    // Validation
    if (!passwordValue || !confirmPasswordValue) {
      this.error.set('Please fill in all password fields');
      return;
    }

    if (passwordValue.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      this.error.set('Passwords do not match');
      return;
    }

    this.settingPassword.set(true);
    this.error.set('');
    this.successMessage.set('');

    try {
      const result = await this.authService.updatePassword(passwordValue);

      if (result.success) {
        this.successMessage.set('Password set successfully! Redirecting to login...');
        
        // Sign out to force re-login with new password
        await this.authService.signOut();
        
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/admin/login'], { 
            queryParams: { message: 'Password set successfully. Please sign in with your new password.' }
          });
        }, 2000);
      } else {
        this.error.set(result.error || 'Failed to set password');
        this.settingPassword.set(false);
      }
    } catch (error: any) {
      this.error.set(error.message || 'An error occurred setting password');
      this.settingPassword.set(false);
    }
  }
}

