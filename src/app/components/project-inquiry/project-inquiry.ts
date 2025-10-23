import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ProjectType {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-project-inquiry',
  imports: [FormsModule, CommonModule],
  templateUrl: './project-inquiry.html',
  styleUrl: './project-inquiry.scss'
})
export class ProjectInquiryComponent {
  projectDescription = '';
  selectedTypes: Set<string> = new Set();
  showContactForm = false;
  
  // Contact form fields
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  generatedMessage = '';

  projectTypes: ProjectType[] = [
    { id: 'website', label: 'Website', icon: '🌐' },
    { id: 'application', label: 'Application', icon: '📱' },
    { id: 'ai-automation', label: 'AI Automation', icon: '🤖' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'consulting', label: 'Consulting', icon: '💡' }
  ];

  toggleProjectType(typeId: string): void {
    if (this.selectedTypes.has(typeId)) {
      this.selectedTypes.delete(typeId);
    } else {
      this.selectedTypes.add(typeId);
    }
  }

  isSelected(typeId: string): boolean {
    return this.selectedTypes.has(typeId);
  }

  generateInquiry(): void {
    // Check if user provided at least something (description or project types)
    if (!this.projectDescription.trim() && this.selectedTypes.size === 0) {
      alert('Please describe your project or select at least one project type!');
      return;
    }

    // Generate a formatted message
    const selectedTypesText = Array.from(this.selectedTypes)
      .map(id => this.projectTypes.find(t => t.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    // Build message based on what's provided
    if (this.projectDescription.trim() && selectedTypesText) {
      // Both description and types provided
      this.generatedMessage = `Project Description: ${this.projectDescription}\n\nProject Type(s): ${selectedTypesText}`;
    } else if (this.projectDescription.trim()) {
      // Only description provided
      this.generatedMessage = `Project Description: ${this.projectDescription}`;
    } else {
      // Only project types provided
      this.generatedMessage = `Project Type(s): ${selectedTypesText}`;
    }

    // Show contact form
    this.showContactForm = true;
  }

  closeContactForm(): void {
    this.showContactForm = false;
  }

  submitInquiry(): void {
    if (!this.contactEmail && !this.contactName && !this.contactPhone) {
      alert('Please provide at least one contact method (email, name, or phone)');
      return;
    }

    // Here you would send this to your backend or email service
    const fullInquiry = {
      message: this.generatedMessage,
      name: this.contactName,
      email: this.contactEmail,
      phone: this.contactPhone,
      timestamp: new Date().toISOString()
    };

    console.log('Project Inquiry:', fullInquiry);
    
    // In production, you'd send this to your backend
    // For now, we'll create a mailto link
    const subject = encodeURIComponent('New Project Inquiry');
    const body = encodeURIComponent(
      `${this.generatedMessage}\n\n---\nContact Information:\nName: ${this.contactName || 'N/A'}\nEmail: ${this.contactEmail || 'N/A'}\nPhone: ${this.contactPhone || 'N/A'}`
    );
    
    window.location.href = `mailto:hello@guytagger.com?subject=${subject}&body=${body}`;
    
    // Reset form
    this.resetForm();
    alert('Thank you! Your inquiry has been sent. I\'ll get back to you soon!');
  }

  resetForm(): void {
    this.projectDescription = '';
    this.selectedTypes.clear();
    this.showContactForm = false;
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.generatedMessage = '';
  }
}

