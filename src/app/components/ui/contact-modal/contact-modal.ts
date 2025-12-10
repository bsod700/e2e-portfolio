import { 
  Component, 
  computed, 
  effect, 
  signal, 
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule
} from '@angular/forms';
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
  private readonly destroyRef = inject(DestroyRef);
  private autoCloseTimer?: ReturnType<typeof setTimeout>;

  // Form group
  contactForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
    message: ['']
  });

  // Form value signals for reactive validation (Angular 20 best practice)
  private readonly nameValue = signal<string>('');
  private readonly emailValue = signal<string>('');
  private readonly phoneValue = signal<string>('');

  // Debounce timers for validation
  private nameDebounceTimer?: ReturnType<typeof setTimeout>;
  private emailDebounceTimer?: ReturnType<typeof setTimeout>;
  private phoneDebounceTimer?: ReturnType<typeof setTimeout>;

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
   * Setup form validation with Signals-based debounced validation (Angular 20 best practice)
   * Uses effects to watch signal changes and debounce validation
   */
  private setupFormValidation(): void {
    // Sync form values to signals - valueChanges automatically fires on input
    // This is the Angular 20 best practice: ReactiveForms + Signals
    this.contactForm.get('name')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.nameValue.set(value || '');
      // Clear error immediately on input (before debounced validation)
      this.nameError.set('');
    });

    this.contactForm.get('email')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.emailValue.set(value || '');
      this.emailError.set('');
    });

    this.contactForm.get('phone')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.phoneValue.set(value || '');
      this.phoneError.set('');
    });

    // Watch name field changes with debounced validation
    effect(() => {
      const value = this.nameValue();
      const control = this.contactForm.get('name');
      
      if (this.nameDebounceTimer) {
        clearTimeout(this.nameDebounceTimer);
      }
      
      this.nameDebounceTimer = setTimeout(() => {
        if (control?.touched) {
          this.validateField('name', value);
        }
      }, VALIDATION_DEBOUNCE_TIME);
    });

    // Watch email field changes with debounced validation
    effect(() => {
      const value = this.emailValue();
      const control = this.contactForm.get('email');
      
      if (this.emailDebounceTimer) {
        clearTimeout(this.emailDebounceTimer);
      }
      
      this.emailDebounceTimer = setTimeout(() => {
        if (control?.touched) {
          this.validateField('email', value);
        }
      }, VALIDATION_DEBOUNCE_TIME);
    });

    // Watch phone field changes with debounced validation
    effect(() => {
      const value = this.phoneValue();
      const control = this.contactForm.get('phone');
      
      if (this.phoneDebounceTimer) {
        clearTimeout(this.phoneDebounceTimer);
      }
      
      this.phoneDebounceTimer = setTimeout(() => {
        if (control?.touched) {
          this.validateField('phone', value);
        }
      }, VALIDATION_DEBOUNCE_TIME);
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
   * Handle field blur events - validate immediately (no debounce)
   */
  onFieldBlur(fieldName: 'name' | 'email' | 'phone'): void {
    const control = this.contactForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      // Validate immediately on blur (no debounce)
      this.validateField(fieldName, control.value || '');
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
    // Note: Keep RxJS for HTTP calls - this is the correct use case for RxJS
    this.emailService.sendContactEmail({
      contactName: formValue.name,
      contactEmail: formValue.email,
      contactPhone: formValue.phone,
      message: formValue.message
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
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
    
    // Clear debounce timers
    if (this.nameDebounceTimer) {
      clearTimeout(this.nameDebounceTimer);
      this.nameDebounceTimer = undefined;
    }
    if (this.emailDebounceTimer) {
      clearTimeout(this.emailDebounceTimer);
      this.emailDebounceTimer = undefined;
    }
    if (this.phoneDebounceTimer) {
      clearTimeout(this.phoneDebounceTimer);
      this.phoneDebounceTimer = undefined;
    }
    
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
    // Clear all timers
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    if (this.nameDebounceTimer) {
      clearTimeout(this.nameDebounceTimer);
    }
    if (this.emailDebounceTimer) {
      clearTimeout(this.emailDebounceTimer);
    }
    if (this.phoneDebounceTimer) {
      clearTimeout(this.phoneDebounceTimer);
    }
  }
}

