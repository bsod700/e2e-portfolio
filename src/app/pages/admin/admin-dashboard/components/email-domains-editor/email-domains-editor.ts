import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailDomainService } from '../../../../../services/email-domain.service';

@Component({
  selector: 'app-email-domains-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-domains-editor.html',
  styleUrl: './email-domains-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDomainsEditorComponent {
  private readonly emailDomainService = inject(EmailDomainService);
  private readonly cdr = inject(ChangeDetectorRef);

  domains: string[] = [];
  newDomain = '';
  loading = false;
  saving = false;
  error = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadDomains();
  }

  loadDomains(): void {
    this.loading = true;
    this.error = '';

    this.emailDomainService.getDisposableEmailDomains().subscribe({
      next: (domains) => {
        this.domains = domains;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading disposable email domains:', error);
        this.error = 'Failed to load disposable email domains.';
        this.loading = false;
        this.cdr.markForCheck();
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

    this.emailDomainService.addDisposableEmailDomain(trimmed).subscribe({
      next: (result) => {
        if (result.success && result.domains) {
          this.domains = result.domains;
          this.newDomain = '';
          this.successMessage = 'Domain added successfully.';
        } else if (!result.success) {
          this.error = (result as any).error || 'Failed to add domain.';
        }
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error adding disposable email domain:', error);
        this.error = 'Failed to add domain.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteDomain(domain: string): void {
    if (!domain) {
      return;
    }

    if (!confirm(`Remove "${domain}" from the block list?`)) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.emailDomainService.deleteDisposableEmailDomain(domain).subscribe({
      next: (result) => {
        if (result.success && result.domains) {
          this.domains = result.domains;
          this.successMessage = 'Domain removed successfully.';
        } else if (!result.success) {
          this.error = (result as any).error || 'Failed to remove domain.';
        }
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting disposable email domain:', error);
        this.error = 'Failed to remove domain.';
        this.saving = false;
        this.cdr.markForCheck();
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


