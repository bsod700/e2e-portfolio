import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailDomainService } from '../../../../../services/email-domain.service';
import { DialogService } from '../../../../../services/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-email-domains-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-domains-editor.html',
  styleUrl: './email-domains-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDomainsEditorComponent implements OnInit {
  private readonly emailDomainService = inject(EmailDomainService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  domains: string[] = [];
  newDomain = '';
  editingIndex: number | null = null;
  editDomainValue = '';
  loading = false;
  saving = false;
  error = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadDomains();
  }

  isEditing(index: number): boolean {
    return this.editingIndex === index;
  }

  startEdit(index: number, domain: string): void {
    if (this.saving) {
      return;
    }
    this.editingIndex = index;
    this.editDomainValue = domain;
    this.error = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.editDomainValue = '';
  }

  loadDomains(): void {
    this.loading = true;
    this.error = '';

    this.emailDomainService
      .getDisposableEmailDomains()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (domains) => {
          this.domains = domains;
        },
        error: (error) => {
          console.error('Error loading disposable email domains:', error);
          this.error = 'Failed to load disposable email domains.';
        }
      });
  }

  addDomain(): void {
    const trimmed = this.newDomain.trim().toLowerCase();
    if (!trimmed) {
      return;
    }

    if (!this.isValidDomain(trimmed)) {
      this.error = 'Please enter a valid domain name (e.g. tempmail.com).';
      this.cdr.markForCheck();
      return;
    }

    if (this.domains.includes(trimmed)) {
      this.error = 'This domain is already in the block list.';
      this.cdr.markForCheck();
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.emailDomainService
      .addDisposableEmailDomain(trimmed)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success && result.domains) {
            this.domains = result.domains;
            this.newDomain = '';
            this.successMessage = 'Domain added successfully.';
          } else if (!result.success) {
            this.error = (result as any).error || 'Failed to add domain.';
          }
        },
        error: (error) => {
          console.error('Error adding disposable email domain:', error);
          this.error = 'Failed to add domain.';
        }
      });
  }

  saveEdit(originalDomain: string, index: number): void {
    if (this.editingIndex !== index) {
      return;
    }

    const trimmed = this.editDomainValue.trim().toLowerCase();
    if (!trimmed) {
      this.error = 'Domain cannot be empty.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.isValidDomain(trimmed)) {
      this.error = 'Please enter a valid domain name (e.g. tempmail.com).';
      this.cdr.markForCheck();
      return;
    }

    // Allow unchanged value, but prevent duplicates across other entries
    const duplicateIndex = this.domains.findIndex((d, i) => i !== index && d === trimmed);
    if (duplicateIndex !== -1) {
      this.error = 'This domain is already in the block list.';
      this.cdr.markForCheck();
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.emailDomainService
      .updateDisposableEmailDomain(originalDomain, trimmed)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success && result.domains) {
            this.domains = result.domains;
            this.successMessage = 'Domain updated successfully.';
            this.cancelEdit();
          } else if (!result.success) {
            this.error = (result as any).error || 'Failed to update domain.';
          }
        },
        error: (error) => {
          console.error('Error updating disposable email domain:', error);
          this.error = 'Failed to update domain.';
        }
      });
  }

  async deleteDomain(domain: string): Promise<void> {
    if (!domain) {
      return;
    }

    const confirmed = await this.dialogService.confirm({
      title: 'Delete domain?',
      message: `This will remove "${domain}" from the blocked email domains list. This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (!confirmed) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.emailDomainService
      .deleteDisposableEmailDomain(domain)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success && result.domains) {
            this.domains = result.domains;
            this.successMessage = 'Domain removed successfully.';
          } else if (!result.success) {
            this.error = (result as any).error || 'Failed to remove domain.';
          }
        },
        error: (error) => {
          console.error('Error deleting disposable email domain:', error);
          this.error = 'Failed to remove domain.';
        }
      });
  }

  trackByDomain(_index: number, domain: string): string {
    return domain;
  }

  private isValidDomain(domain: string): boolean {
    // Simple domain validation: at least one dot and no spaces
    return /^[^\s@]+\.[^\s@]+$/.test(domain);
  }
}


