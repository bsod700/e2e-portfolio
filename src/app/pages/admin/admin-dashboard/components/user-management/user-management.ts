import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService, AdminUser } from '../../../../../services/user-management.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent implements OnInit {
  private readonly userService = inject(UserManagementService);

  users = signal<AdminUser[]>([]);
  loading = signal(false);
  error = signal('');
  successMessage = signal('');

  // Form state
  showAddForm = signal(false);
  newUserEmail = '';
  editingUserId: string | null = null;

  // Confirmation state
  deletingUserId: string | null = null;
  resettingUserEmail: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    
    const { data, error } = await this.userService.getAllUsers();
    
    if (error) {
      this.error.set(error);
      this.loading.set(false);
      return;
    }

    this.users.set(data || []);
    this.loading.set(false);
  }

  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
    this.newUserEmail = '';
    this.error.set('');
    this.successMessage.set('');
  }

  async addUser(): Promise<void> {
    if (!this.newUserEmail.trim()) {
      this.error.set('Please enter an email address');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const result = await this.userService.addUser(this.newUserEmail.trim());

    if (result.success) {
      this.successMessage.set(result.message || 'User added successfully');
      this.newUserEmail = '';
      this.showAddForm.set(false);
      await this.loadUsers();
    } else {
      this.error.set(result.error || 'Failed to add user');
    }

    this.loading.set(false);
  }

  async deleteUser(user: AdminUser): Promise<void> {
    if (!confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const result = await this.userService.deleteUser(user.id, user.email);

    if (result.success) {
      this.successMessage.set(result.message || 'User deleted successfully');
      await this.loadUsers();
    } else {
      this.error.set(result.error || 'Failed to delete user');
    }

    this.loading.set(false);
  }

  async sendPasswordReset(user: AdminUser): Promise<void> {
    if (!confirm(`Send password reset email to ${user.email}?`)) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const result = await this.userService.sendPasswordReset(user.email);

    if (result.success) {
      this.successMessage.set(result.message || 'Password reset email sent successfully');
    } else {
      this.error.set(result.error || 'Failed to send password reset email');
    }

    this.loading.set(false);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }
}

