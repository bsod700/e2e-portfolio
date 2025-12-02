import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-password-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-management.html',
  styleUrl: './password-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordManagementComponent {
  private readonly authService = inject(AuthService);

  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;
  updatingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  @Output() readonly close = new EventEmitter<void>();

  onCancel(): void {
    this.close.emit();
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Runs basic client-side validations and returns an error message if invalid,
   * otherwise returns null.
   */
  private validatePasswords(): string | null {
    if (!this.newPassword || !this.confirmPassword) {
      return 'Please fill in all password fields';
    }

    if (this.newPassword.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (this.newPassword !== this.confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  }

  private getCurrentUserEmail(): string {
    const currentUser = this.authService.currentUser();
    return currentUser?.email || 'your account';
  }

  async updatePassword(): Promise<void> {
    this.passwordError = '';
    this.passwordSuccess = '';

    const validationError = this.validatePasswords();
    if (validationError) {
      this.passwordError = validationError;
      return;
    }

    const currentEmail = this.getCurrentUserEmail();

    if (!confirm(`This will change the password for ${currentEmail}. Continue?`)) {
      return;
    }

    this.updatingPassword = true;
    try {
      const result = await this.authService.updatePassword(this.newPassword);

      if (result.success) {
        this.passwordSuccess = 'Password updated successfully!';
        this.newPassword = '';
        this.confirmPassword = '';

        setTimeout(() => {
          this.passwordSuccess = '';
          // Only emit close if there are listeners (optional)
          if (this.close.observers.length > 0) {
            this.close.emit();
          }
        }, 3000);
      } else {
        this.passwordError = result.error || 'Failed to update password';
      }
    } catch (error) {
      console.error('Error updating password', error);
      this.passwordError = 'An unexpected error occurred while updating password';
    } finally {
      this.updatingPassword = false;
    }
  }
}

