import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

const INITIAL_AUTH_DELAY_MS = 1000;
const AUTH_RETRY_DELAY_MS = 500;
const AUTH_MAX_RETRIES = 5;

@Component({
  selector: 'app-admin-setup-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-setup-password.html',
  styleUrl: './admin-setup-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSetupPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');
  readonly settingPassword = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly successMessage = signal<string>('');

  ngOnInit(): void {
    // Handle auth callback from email link
    void this.handleAuthCallback();
  }

  private async handleAuthCallback(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const { accessToken, type, error } = this.getAuthParamsFromUrl();

    if (error) {
      this.error.set(
        `Authentication error: ${error}. Please request a new invitation email.`,
      );
      this.clearUrl();
      return;
    }

    const hasAuthToken = Boolean(type === 'recovery' || type === 'magiclink' || accessToken);

    if (hasAuthToken) {
      // Wait for Supabase to process the token and create session
      await this.wait(INITIAL_AUTH_DELAY_MS);

      const isAuthenticated = await this.waitForAuthentication();

      if (accessToken) {
        this.clearUrl();
      }

      if (isAuthenticated) {
        this.successMessage.set(
          'Please set your password to complete your account setup.',
        );
      } else {
        this.error.set(
          'Authentication failed. The link may have expired. Please request a new invitation email.',
        );
      }
      return;
    }

    // No token in URL - check if already authenticated
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.successMessage.set(
        'Please set your password to complete your account setup.',
      );
    } else {
      this.error.set(
        'No authentication token found. Please use the link from your email.',
      );
    }
  }

  async setPassword(): Promise<void> {
    const passwordValue = this.password();
    const confirmPasswordValue = this.confirmPassword();

    const validationError = this.validatePasswords(passwordValue, confirmPasswordValue);
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.settingPassword.set(true);
    this.error.set('');
    this.successMessage.set('');

    try {
      const result = await this.authService.updatePassword(passwordValue);

      if (!result.success) {
        this.error.set(result.error || 'Failed to set password');
        return;
      }

      this.successMessage.set(
        'Password set successfully! Redirecting to login...',
      );

      // Sign out to force re-login with new password
      await this.authService.signOut();

      // Redirect to login after a short delay
      setTimeout(() => {
        this.router.navigate(['/admin/login'], {
          queryParams: {
            message:
              'Password set successfully. Please sign in with your new password.',
          },
        });
      }, 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred setting password';
      this.error.set(message);
    } finally {
      this.settingPassword.set(false);
    }
  }

  private getAuthParamsFromUrl(): {
    accessToken: string | null;
    type: string | null;
    error: string | null;
  } {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const accessToken =
      hashParams.get('access_token') || queryParams.get('access_token');
    const type = hashParams.get('type') || queryParams.get('type');
    const error = hashParams.get('error') || queryParams.get('error');

    return { accessToken, type, error };
  }

  private clearUrl(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  private async waitForAuthentication(): Promise<boolean> {
    let isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }

    for (let attempt = 0; attempt < AUTH_MAX_RETRIES; attempt++) {
      await this.wait(AUTH_RETRY_DELAY_MS);
      isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        return true;
      }
    }

    return false;
  }

  private async wait(durationMs: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, durationMs));
  }

  private validatePasswords(
    passwordValue: string,
    confirmPasswordValue: string,
  ): string | null {
    if (!passwordValue || !confirmPasswordValue) {
      return 'Please fill in all password fields';
    }

    if (passwordValue.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (passwordValue !== confirmPasswordValue) {
      return 'Passwords do not match';
    }

    return null;
  }
}
