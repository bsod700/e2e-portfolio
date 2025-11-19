import { Component, Input } from '@angular/core';
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
  @Input() classType: string = 'default';
  
  projectDescription = '';
  selectedTypes: Set<string> = new Set();
  showContactForm = false;
  inputGlowStyle: { [key: string]: string } = {
    '--px': '-1000px',
    '--py': '-1000px',
    '--hover': '0'
  };
  
  // Contact form fields
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  generatedMessage = '';

  // Synchronized with Figma "cta input" labels
  projectTypes: ProjectType[] = [
    { id: 'website', label: 'Website', icon: '' },
    { id: 'application', label: 'Application', icon: '' },
    { id: 'ai-automation', label: 'Ai automation', icon: '' },
    { id: 'landing-page', label: 'Landing page', icon: '' },
    { id: 'logo', label: 'Logo', icon: '' },
    { id: 'mobile-app', label: 'Mobile App', icon: '' },
    { id: 'web-extension', label: 'Web Extension', icon: '' },
    { id: 'design-system', label: 'Design System', icon: '' },
    { id: 'other', label: 'Other', icon: '' }
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

  onInputPointerMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.inputGlowStyle = {
      ...this.inputGlowStyle,
      '--px': `${x}px`,
      '--py': `${y}px`
    };
  }

  onInputEnter(): void {
    this.inputGlowStyle = { ...this.inputGlowStyle, '--hover': '1' };
  }

  onInputLeave(): void {
    this.inputGlowStyle = { ...this.inputGlowStyle, '--hover': '0' };
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

