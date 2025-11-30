import { 
  Component, 
  computed, 
  effect, 
  signal, 
  ChangeDetectionStrategy,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule
} from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { EmailService } from '../../../services/email.service';
import { ValidationService } from '../../../services/validation.service';

// Constants
const AUTO_CLOSE_DELAY = 3000;
const VALIDATION_DEBOUNCE_TIME = 300;

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactModalComponent implements OnDestroy {
  private readonly modalService = inject(ModalService);
  private readonly emailService = inject(EmailService);
  private readonly validationService = inject(ValidationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();
  private autoCloseTimer?: ReturnType<typeof setTimeout>;

  // Form group
  contactForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
    message: ['']
  });

  // State signals
  readonly isSubmitted = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly generalError = signal<string>('');

  // Computed signals
  readonly showContactForm = computed(() => this.modalService.showContactModal());
  readonly isFormDisabled = computed(() => this.isLoading() || this.isSubmitted());

  // Error signals for reactive display
  readonly nameError = signal<string>('');
  readonly emailError = signal<string>('');
  readonly phoneError = signal<string>('');

  constructor() {
    this.setupFormValidation();
    this.setupModalSync();
  }

  /**
   * Setup form validation with debounced field validation
   */
  private setupFormValidation(): void {
    // Debounced validation for name field
    this.contactForm.get('name')?.valueChanges.pipe(
      debounceTime(VALIDATION_DEBOUNCE_TIME),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (this.contactForm.get('name')?.touched) {
        this.validateField('name', value);
      }
    });

    // Debounced validation for email field
    this.contactForm.get('email')?.valueChanges.pipe(
      debounceTime(VALIDATION_DEBOUNCE_TIME),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (this.contactForm.get('email')?.touched) {
        this.validateField('email', value);
      }
    });

    // Debounced validation for phone field
    this.contactForm.get('phone')?.valueChanges.pipe(
      debounceTime(VALIDATION_DEBOUNCE_TIME),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (this.contactForm.get('phone')?.touched) {
        this.validateField('phone', value);
      }
    });
  }

  /**
   * Sync modal data to form when modal opens
   */
  private setupModalSync(): void {
    effect(() => {
      const modalData = this.modalService.modalData();
      const isOpen = this.modalService.showContactModal();
      
      if (isOpen) {
        // Reset form state
        this.resetFormState();
        
        // Populate form with modal data
        this.contactForm.patchValue({
          name: modalData.contactName || '',
          email: modalData.contactEmail || '',
          phone: modalData.contactPhone || '',
          message: modalData.generatedMessage || ''
        }, { emitEvent: false });
      }
    });
  }

  /**
   * Validate a specific form field
   */
  private validateField(fieldName: 'name' | 'email' | 'phone', value: string): void {
    let result: { isValid: boolean; errorMessage: string };

    switch (fieldName) {
      case 'name':
        result = this.validationService.validateName(value);
        this.nameError.set(result.errorMessage);
        break;
      case 'email':
        result = this.validationService.validateEmail(value);
        this.emailError.set(result.errorMessage);
        break;
      case 'phone':
        result = this.validationService.validatePhone(value);
        this.phoneError.set(result.errorMessage);
        break;
    }
  }

  /**
   * Validate all form fields
   */
  private validateAllFields(): boolean {
    const formValue = this.contactForm.value;
    let isValid = true;

    // Validate name
    const nameResult = this.validationService.validateName(formValue.name);
    this.nameError.set(nameResult.errorMessage);
    if (!nameResult.isValid) isValid = false;

    // Validate email
    const emailResult = this.validationService.validateEmail(formValue.email);
    this.emailError.set(emailResult.errorMessage);
    if (!emailResult.isValid) isValid = false;

    // Validate phone
    const phoneResult = this.validationService.validatePhone(formValue.phone);
    this.phoneError.set(phoneResult.errorMessage);
    if (!phoneResult.isValid) isValid = false;

    // Check if at least one contact method is provided
    if (!this.validationService.hasAtLeastOneContactMethod(
      formValue.name,
      formValue.email,
      formValue.phone
    )) {
      const errorMsg = 'Please provide at least one contact method';
      this.nameError.set(errorMsg);
      this.emailError.set(errorMsg);
      this.phoneError.set(errorMsg);
      isValid = false;
    }

    return isValid;
  }

  /**
   * Handle field blur events
   */
  onFieldBlur(fieldName: 'name' | 'email' | 'phone'): void {
    const control = this.contactForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      this.validateField(fieldName, control.value);
    }
  }

  /**
   * Clear field error on input
   */
  onFieldInput(fieldName: 'name' | 'email' | 'phone'): void {
    switch (fieldName) {
      case 'name':
        this.nameError.set('');
        break;
      case 'email':
        this.emailError.set('');
        break;
      case 'phone':
        this.phoneError.set('');
        break;
    }
  }

  /**
   * Close the contact form modal
   */
  closeContactForm(): void {
    this.modalService.closeContactModal();
  }

  /**
   * Submit the contact form
   */
  submitInquiry(): void {
    // Clear previous errors
    this.clearErrors();

    // Mark all fields as touched for validation display
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    // Validate all fields
    if (!this.validateAllFields()) {
      return;
    }

    const formValue = this.contactForm.value;
    
    // Start loading
    this.isLoading.set(true);

    // Update the modal data in service with edited message
    this.modalService.updateModalData({
      generatedMessage: formValue.message,
      contactName: formValue.name,
      contactEmail: formValue.email,
      contactPhone: formValue.phone
    });

    // Send email through backend API
    this.emailService.sendContactEmail({
      contactName: formValue.name,
      contactEmail: formValue.email,
      contactPhone: formValue.phone,
      message: formValue.message
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
        
        // Stop loading and show thank you message
        this.isLoading.set(false);
        this.isSubmitted.set(true);
        
        // Auto-close after delay
        this.autoCloseTimer = setTimeout(() => {
          this.resetForm();
        }, AUTO_CLOSE_DELAY);
      },
      error: (error) => {
        console.error('Failed to send email:', error);
        
        // Stop loading
        this.isLoading.set(false);
        
        // Show inline error message
        this.generalError.set(
          error.message || 'Failed to send email. Please try again or contact me directly at gt@guytagger.com'
        );
      }
    });
  }

  /**
   * Clear all error messages
   */
  private clearErrors(): void {
    this.nameError.set('');
    this.emailError.set('');
    this.phoneError.set('');
    this.generalError.set('');
  }

  /**
   * Reset form state
   */
  private resetFormState(): void {
    this.isSubmitted.set(false);
    this.isLoading.set(false);
    this.clearErrors();
    
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
  }

  /**
   * Reset form and close modal
   */
  resetForm(): void {
    this.resetFormState();
    this.contactForm.reset();
    this.modalService.closeContactModal();
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}

