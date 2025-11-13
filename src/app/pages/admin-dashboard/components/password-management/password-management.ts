import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-password-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-management.html',
  styleUrl: './password-management.scss'
})
export class PasswordManagementComponent {
  private authService = inject(AuthService);

  newPassword = '';
  confirmPassword = '';
  updatingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  @Output() close = new EventEmitter<void>();

  async updatePassword(): Promise<void> {
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Please fill in all password fields';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return;
    }

    this.updatingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    const result = await this.authService.updatePassword(this.newPassword);

    if (result.success) {
      this.passwordSuccess = 'Password updated successfully!';
      this.newPassword = '';
      this.confirmPassword = '';
      setTimeout(() => {
        this.passwordSuccess = '';
        this.close.emit();
      }, 3000);
    } else {
      this.passwordError = result.error || 'Failed to update password';
    }

    this.updatingPassword = false;
  }

  onCancel(): void {
    this.close.emit();
  }
}

