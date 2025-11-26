import { Injectable, signal } from '@angular/core';

export interface ContactModalData {
  generatedMessage: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Signals for modal state management
  private showContactModalSignal = signal<boolean>(false);
  private modalDataSignal = signal<ContactModalData>({
    generatedMessage: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Public readonly signals
  readonly showContactModal = this.showContactModalSignal.asReadonly();
  readonly modalData = this.modalDataSignal.asReadonly();

  openContactModal(data: ContactModalData): void {
    this.modalDataSignal.set(data);
    this.showContactModalSignal.set(true);
  }

  closeContactModal(): void {
    this.showContactModalSignal.set(false);
  }

  updateModalData(data: Partial<ContactModalData>): void {
    const currentData = this.modalDataSignal();
    this.modalDataSignal.set({ ...currentData, ...data });
  }

  getModalData(): ContactModalData {
    return this.modalDataSignal();
  }
}

