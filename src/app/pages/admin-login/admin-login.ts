import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'guytagger@gmail.com'; // Pre-fill with allowed email
  password = '';
  useMagicLink = false;
  loading = false;
  error = '';
  successMessage = '';

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authService.isAuthenticated().pipe(take(1)).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/admin']);
      }
    });

    // Also check for auth callback in URL
    this.checkAuthCallback();
  }

  private async checkAuthCallback(): Promise<void> {
    // Small delay to allow auth service to process callback
    setTimeout(() => {
      this.authService.isAuthenticated().pipe(take(1)).subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/admin']);
        }
      });
    }, 500);
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

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
        this.router.navigate(['/admin']);
      } else {
        this.error = result.error || 'Failed to sign in';
      }
    }

    this.loading = false;
  }

  toggleAuthMethod(): void {
    this.useMagicLink = !this.useMagicLink;
    this.error = '';
    this.successMessage = '';
  }

  async checkAuthStatus(): Promise<void> {
    this.loading = true;
    this.error = '';
    
    this.authService.isAuthenticated().pipe(take(1)).subscribe(async isAuthenticated => {
      if (isAuthenticated) {
        this.successMessage = 'You are signed in! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 500);
      } else {
        this.error = 'You are not signed in. Please use magic link or password to sign in.';
      }
      this.loading = false;
    });
  }
}

