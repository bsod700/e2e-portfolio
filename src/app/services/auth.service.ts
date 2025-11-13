import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly ALLOWED_EMAIL = 'guytagger@gmail.com';

  constructor() {
    this.initAuth();
    this.handleAuthCallback();
  }

  private async initAuth(): Promise<void> {
    const client = this.supabaseService.client;
    if (!client) return;

    const { data: { session } } = await client.auth.getSession();
    if (session?.user) {
      if (this.isAllowedEmail(session.user.email || '')) {
        this.currentUserSubject.next(session.user);
      } else {
        // Immediately sign out if email is not allowed
        console.warn('Unauthorized email detected, signing out:', session.user.email);
        await this.signOut();
      }
    }

    client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (this.isAllowedEmail(session.user.email || '')) {
          this.currentUserSubject.next(session.user);
        } else {
          // Immediately sign out if email is not allowed
          console.warn('Unauthorized email detected, signing out:', session.user.email);
          await this.signOut();
          this.currentUserSubject.next(null);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  private async handleAuthCallback(): Promise<void> {
    const client = this.supabaseService.client;
    if (!client || typeof window === 'undefined') return;

    // Handle magic link callback - check both hash and query params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const error = hashParams.get('error') || queryParams.get('error');
    const type = hashParams.get('type') || queryParams.get('type');

    if (error) {
      console.error('Auth error:', error);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Handle magic link callback
    if (type === 'magiclink' || accessToken) {
      try {
        // Wait a bit for Supabase to process the token
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the session (Supabase should have processed the token by now)
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          if (this.isAllowedEmail(session.user.email || '')) {
            this.currentUserSubject.next(session.user);
            // Clean up the URL first
            window.history.replaceState({}, document.title, '/admin');
            // Then redirect to admin dashboard
            setTimeout(() => {
              this.router.navigate(['/admin'], { replaceUrl: true });
            }, 100);
          } else {
            console.error('Access denied: Email not allowed');
            await this.signOut();
          }
        } else {
          // No session yet, might need to wait a bit more
          setTimeout(async () => {
            const { data: { session: retrySession } } = await client.auth.getSession();
            if (retrySession?.user && this.isAllowedEmail(retrySession.user.email || '')) {
              this.currentUserSubject.next(retrySession.user);
              window.history.replaceState({}, document.title, '/admin');
              this.router.navigate(['/admin'], { replaceUrl: true });
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
      }
    }
  }

  async signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!this.isAllowedEmail(data.user?.email || '')) {
        await this.signOut();
        return { 
          success: false, 
          error: `Access denied. Only admin can access this area.` 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  }

  async signInWithMagicLink(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    // STRICT EMAIL CHECK - Only allow the specific email
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAllowed = this.ALLOWED_EMAIL.trim().toLowerCase();
    
    if (normalizedEmail !== normalizedAllowed) {
      return { 
        success: false, 
        error: `Access denied. Only ${this.ALLOWED_EMAIL} can access this area.` 
      };
    }

    try {
      const { error } = await client.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: `Magic link sent to ${this.ALLOWED_EMAIL}. Check your email to sign in.` 
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred sending magic link' };
    }
  }

  async signOut(): Promise<void> {
    const client = this.supabaseService.client;
    if (client) {
      await client.auth.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/admin/login']);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user) return false;
        return user.email === this.ALLOWED_EMAIL;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAllowedEmail(email: string): boolean {
    if (!email) return false;
    // Case-insensitive comparison for security
    return email.trim().toLowerCase() === this.ALLOWED_EMAIL.trim().toLowerCase();
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { error } = await client.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred updating password' };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    if (email !== this.ALLOWED_EMAIL) {
      return { success: false, error: 'Access denied. Only authorized emails can reset password.' };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Password reset email sent! Check your email for instructions.' 
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred sending reset email' };
    }
  }
}

