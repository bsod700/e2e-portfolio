import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogConfig {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly isOpenSignal = signal(false);
  private readonly configSignal = signal<ConfirmDialogConfig | null>(null);
  private resolveFn: ((result: boolean) => void) | null = null;

  readonly isOpen = this.isOpenSignal.asReadonly();
  readonly config = this.configSignal.asReadonly();

  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    // Close any existing dialog
    if (this.resolveFn) {
      this.resolveFn(false);
      this.resolveFn = null;
    }

    this.configSignal.set({
      title: config.title ?? 'Are you sure?',
      confirmLabel: config.confirmLabel ?? 'Confirm',
      cancelLabel: config.cancelLabel ?? 'Cancel',
      variant: config.variant ?? 'default',
      message: config.message,
    });
    this.isOpenSignal.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  close(result: boolean): void {
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
    this.isOpenSignal.set(false);
  }
}


