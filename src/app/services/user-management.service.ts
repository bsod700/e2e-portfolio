import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  created_at?: string;
}

interface UserManagementResult {
  success: boolean;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly authService = inject(AuthService);

  /**
   * Get all admin users
   */
  async getAllUsers(): Promise<{ data: AdminUser[] | null; error: string | null }> {
    const client = this.supabaseService.client;
    if (!client) {
      return { data: null, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Check if table doesn't exist
        if (error.message?.includes('admin_users') || error.message?.includes('schema cache')) {
          return { 
            data: null, 
            error: 'The admin_users table does not exist. Please run the SQL script in scripts/create-admin-users-table.sql in your Supabase SQL Editor to create it.' 
          };
        }
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error: any) {
      if (error.message?.includes('admin_users') || error.message?.includes('schema cache')) {
        return { 
          data: null, 
          error: 'The admin_users table does not exist. Please run the SQL script in scripts/create-admin-users-table.sql in your Supabase SQL Editor to create it.' 
        };
      }
      return { data: null, error: error.message || 'Failed to fetch users' };
    }
  }

  /**
   * Add a new admin user
   */
  async addUser(email: string): Promise<UserManagementResult> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    // Validate email
    if (!email || !this.isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    try {
      // Check if user already exists
      const { data: existing } = await client
        .from('admin_users')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existing) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Add to admin_users table
      const { error } = await client
        .from('admin_users')
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        // Check if table doesn't exist
        if (error.message?.includes('admin_users') || error.message?.includes('schema cache')) {
          return { 
            success: false, 
            error: 'The admin_users table does not exist. Please run the SQL script in scripts/create-admin-users-table.sql in your Supabase SQL Editor to create it.' 
          };
        }
        return { success: false, error: error.message };
      }

      // Send invitation email to the new user (using magic link which works for new users)
      const normalizedEmail = email.toLowerCase().trim();
      const inviteResult = await this.sendInvitationEmail(normalizedEmail);

      if (!inviteResult.success) {
        // User was added to admin_users but email failed - still return success but with warning
        return {
          success: true,
          message: `User ${email} added successfully, but invitation email failed: ${inviteResult.error}. You can send it manually using the "Reset Password" button.`
        };
      }

      return { 
        success: true, 
        message: `User ${email} added successfully. An invitation email with sign-in link has been sent to their inbox.` 
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to add user' };
    }
  }

  /**
   * Delete an admin user
   */
  async deleteUser(userId: string, email: string): Promise<UserManagementResult> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      // Get current user to prevent self-deletion
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.email?.toLowerCase() === email.toLowerCase()) {
        return { success: false, error: 'You cannot delete your own account' };
      }

      const { error } = await client
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) {
        // Check if table doesn't exist
        if (error.message?.includes('admin_users') || error.message?.includes('schema cache')) {
          return { 
            success: false, 
            error: 'The admin_users table does not exist. Please run the SQL script in scripts/create-admin-users-table.sql in your Supabase SQL Editor to create it.' 
          };
        }
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: `User ${email} deleted successfully` 
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete user' };
    }
  }

  /**
   * Send invitation email to a new user (using password reset)
   * This works for users that don't exist in Supabase Auth yet
   * Uses password reset flow instead of magic link
   */
  async sendInvitationEmail(email: string): Promise<UserManagementResult> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      // Build redirect URL for password setup page
      const baseUrl = this.getBaseUrl();
      const redirectUrl = `${baseUrl}/admin/setup-password`;

      console.log('[UserManagement] Sending password setup email to:', email);
      console.log('[UserManagement] Redirect URL:', redirectUrl);

      // Use password reset flow which works for new users and creates account
      const { error } = await client.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('[UserManagement] Error sending invitation:', error);
        
        // Handle rate limiting with user-friendly message
        if (error.message?.includes('rate limit') || error.message?.includes('429')) {
          return { 
            success: false, 
            error: 'Email rate limit exceeded. Please wait a few minutes before sending another invitation email. Supabase limits email sending to prevent spam.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log('[UserManagement] Invitation email sent successfully');
      return { 
        success: true, 
        message: 'Invitation email sent! Check your email for the sign-in link.' 
      };
    } catch (error: any) {
      console.error('[UserManagement] Exception sending invitation:', error);
      return { success: false, error: error.message || 'An error occurred sending invitation email' };
    }
  }

  /**
   * Update password for a specific user (admin function)
   * Note: This requires the user to be authenticated via password reset link first
   * For direct password changes, use sendPasswordReset instead
   */
  async updateUserPassword(email: string, newPassword: string): Promise<UserManagementResult> {
    // Note: Supabase client SDK doesn't allow setting another user's password directly
    // This would require Admin API with service role key (server-side only)
    // For security, we only allow users to set their own password via reset link
    return {
      success: false,
      error: 'Cannot directly set another user\'s password. Please use "Reset Password" to send them a password reset email.'
    };
  }

  /**
   * Send password reset email to a user (for existing users)
   */
  async sendPasswordReset(email: string): Promise<UserManagementResult> {
    const client = this.supabaseService.client;
    if (!client) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      // Build redirect URL for password reset
      const baseUrl = this.getBaseUrl();
      const redirectUrl = `${baseUrl}/admin/reset-password`;

      console.log('[UserManagement] Sending password reset email to:', email);
      console.log('[UserManagement] Redirect URL:', redirectUrl);

      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('[UserManagement] Error sending password reset:', error);
        
        // Handle rate limiting with user-friendly message
        if (error.message?.includes('rate limit') || error.message?.includes('429')) {
          return { 
            success: false, 
            error: 'Email rate limit exceeded. Please wait a few minutes before sending another password reset email.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log('[UserManagement] Password reset email sent successfully');
      return { 
        success: true, 
        message: 'Password setup email sent! Check your email for instructions.' 
      };
    } catch (error: any) {
      console.error('[UserManagement] Exception sending password reset:', error);
      return { success: false, error: error.message || 'An error occurred sending password setup email' };
    }
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
      console.error('[UserManagement] ERROR: environment.siteUrl is not configured in production! Using fallback:', fallbackUrl);
    }
    
    return fallbackUrl;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

