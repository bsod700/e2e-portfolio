import { Component, Input, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';

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
  
  // Regular property for form input (works with ngModel)
  projectDescription = '';
  
  // Signals for other reactive state
  selectedTypes = signal<Set<string>>(new Set());
  inputGlowStyle = signal<{ [key: string]: string }>({
    '--px': '-1000px',
    '--py': '-1000px',
    '--hover': '0'
  });
  
  // Computed signal to check if modal is showing
  showContactForm = computed(() => this.modalService.showContactModal());

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

  constructor(private modalService: ModalService) {}

  toggleProjectType(typeId: string): void {
    const currentTypes = new Set(this.selectedTypes());
    if (currentTypes.has(typeId)) {
      currentTypes.delete(typeId);
    } else {
      currentTypes.add(typeId);
    }
    this.selectedTypes.set(currentTypes);
  }

  isSelected(typeId: string): boolean {
    return this.selectedTypes().has(typeId);
  }

  generateInquiry(): void {
    // Generate a formatted message
    const selectedTypesText = Array.from(this.selectedTypes())
      .map(id => this.projectTypes.find(t => t.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    let generatedMessage = '';
    
    // Build message based on what's provided
    if (this.projectDescription.trim() && selectedTypesText) {
      // Both description and types provided
      generatedMessage = `Project Description: ${this.projectDescription}\n\nProject Type(s): ${selectedTypesText}`;
    } else if (this.projectDescription.trim()) {
      // Only description provided
      generatedMessage = `Project Description: ${this.projectDescription}`;
    } else if (selectedTypesText) {
      // Only project types provided
      generatedMessage = `Project Type(s): ${selectedTypesText}`;
    } else {
      // Nothing provided - use a default message
      generatedMessage = 'I would like to discuss a potential project.';
    }

    // Open modal via service
    this.modalService.openContactModal({
      generatedMessage,
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
  }

  onInputPointerMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.inputGlowStyle.set({
      ...this.inputGlowStyle(),
      '--px': `${x}px`,
      '--py': `${y}px`
    });
  }

  onInputEnter(): void {
    this.inputGlowStyle.update(style => ({ ...style, '--hover': '1' }));
  }

  onInputLeave(): void {
    this.inputGlowStyle.update(style => ({ ...style, '--hover': '0' }));
  }
}

