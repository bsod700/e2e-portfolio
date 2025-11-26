import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss'
})
export class ContactModalComponent {
  // Regular properties for form inputs (work with ngModel)
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  editableMessage = '';
  isSubmitted = false;
  isLoading = false;

  // Validation error messages
  nameError = '';
  emailError = '';
  phoneError = '';
  generalError = '';

  // Computed signals from service
  showContactForm = computed(() => this.modalService.showContactModal());

  constructor(
    private modalService: ModalService,
    private emailService: EmailService
  ) {
    // Effect to sync modal data to local properties when modal opens
    effect(() => {
      const modalData = this.modalService.modalData();
      if (this.modalService.showContactModal()) {
        this.contactName = modalData.contactName;
        this.contactEmail = modalData.contactEmail;
        this.contactPhone = modalData.contactPhone;
        this.editableMessage = modalData.generatedMessage;
        this.isSubmitted = false; // Reset submitted state when modal opens
        this.isLoading = false; // Reset loading state
        this.clearErrors(); // Clear validation errors
      }
    });
  }

  closeContactForm(): void {
    this.modalService.closeContactModal();
  }

  validateName(): boolean {
    this.nameError = '';
    if (this.contactName.trim()) {
      // Check if name contains numbers
      if (/\d/.test(this.contactName)) {
        this.nameError = 'Name must not contain numbers';
        return false;
      }
    }
    return true;
  }

  validateEmail(): boolean {
    this.emailError = '';
    if (this.contactEmail.trim()) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.contactEmail)) {
        this.emailError = 'Please enter a valid email address';
        return false;
      }

      // Check for disposable/fake email domains
      const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com', 'fff.com', 'test.com', 'example.com', 'fake.com'];
      const emailDomain = this.contactEmail.split('@')[1]?.toLowerCase();
      
      if (disposableDomains.includes(emailDomain)) {
        this.emailError = 'Please use a valid business or personal email address';
        return false;
      }
    }
    return true;
  }

  validatePhone(): boolean {
    this.phoneError = '';
    if (this.contactPhone.trim()) {
      // Check if phone contains only digits, spaces, dashes, parentheses, and +
      if (!/^[\d\s\-+()]+$/.test(this.contactPhone)) {
        this.phoneError = 'Phone number must contain only digits and dashes';
        return false;
      }
    }
    return true;
  }

  clearErrors(): void {
    this.nameError = '';
    this.emailError = '';
    this.phoneError = '';
    this.generalError = '';
  }

  submitInquiry(): void {
    // Clear previous errors
    this.clearErrors();

    // Validate all fields
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isPhoneValid = this.validatePhone();

    // Check if at least one contact method is provided
    if (!this.contactEmail.trim() && !this.contactName.trim() && !this.contactPhone.trim()) {
      this.nameError = 'Please provide at least one contact method';
      this.emailError = 'Please provide at least one contact method';
      this.phoneError = 'Please provide at least one contact method';
      return;
    }

    // Check if all provided fields are valid
    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      return;
    }

    // Start loading
    this.isLoading = true;

    // Update the modal data in service with edited message
    this.modalService.updateModalData({
      generatedMessage: this.editableMessage,
      contactName: this.contactName,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone
    });

    // Send email through backend API
    this.emailService.sendContactEmail({
      contactName: this.contactName,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      message: this.editableMessage
    }).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
        
        // Stop loading and show thank you message
        this.isLoading = false;
        this.isSubmitted = true;
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to send email:', error);
        
        // Stop loading
        this.isLoading = false;
        
        // Show inline error message
        this.generalError = error.message || 'Failed to send email. Please try again or contact me directly at gt@guytagger.com';
      }
    });
  }

  resetForm(): void {
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.editableMessage = '';
    this.isSubmitted = false;
    this.isLoading = false;
    this.clearErrors();
    this.modalService.closeContactModal();
  }
}

