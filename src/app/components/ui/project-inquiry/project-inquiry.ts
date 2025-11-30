import { 
  Component, 
  Input, 
  signal, 
  computed, 
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';

export interface ProjectType {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

interface InputGlowStyle {
  readonly '--px': string;
  readonly '--py': string;
  readonly '--hover': string;
}

const DEFAULT_GLOW_STYLE: InputGlowStyle = {
  '--px': '-1000px',
  '--py': '-1000px',
  '--hover': '0'
} as const;

const PROJECT_TYPES: readonly ProjectType[] = [
  { id: 'website', label: 'Website', icon: '' },
  { id: 'application', label: 'Application', icon: '' },
  { id: 'ai-automation', label: 'Ai automation', icon: '' },
  { id: 'landing-page', label: 'Landing page', icon: '' },
  { id: 'logo', label: 'Logo', icon: '' },
  { id: 'mobile-app', label: 'Mobile App', icon: '' },
  { id: 'web-extension', label: 'Web Extension', icon: '' },
  { id: 'design-system', label: 'Design System', icon: '' },
  { id: 'other', label: 'Other', icon: '' }
] as const;

@Component({
  selector: 'app-project-inquiry',
  imports: [FormsModule, CommonModule],
  templateUrl: './project-inquiry.html',
  styleUrl: './project-inquiry.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectInquiryComponent {
  @Input() classType: string = 'default';
  
  // Regular property for form input (works with ngModel)
  projectDescription = '';
  
  // Signals for reactive state
  private readonly selectedTypes = signal<Set<string>>(new Set());
  readonly inputGlowStyle = signal<InputGlowStyle>(DEFAULT_GLOW_STYLE);
  
  // Computed signal to check if modal is showing
  readonly showContactForm = computed(() => this.modalService.showContactModal());

  // Computed signal for selected types labels
  readonly selectedTypesLabels = computed(() => {
    const selected = this.selectedTypes();
    if (selected.size === 0) return '';
    
    return Array.from(selected)
      .map(id => PROJECT_TYPES.find(t => t.id === id)?.label)
      .filter(Boolean)
      .join(', ');
  });

  // Readonly project types array
  readonly projectTypes = PROJECT_TYPES;

  private readonly modalService = inject(ModalService);

  /**
   * Toggle project type selection
   */
  toggleProjectType(typeId: string): void {
    this.selectedTypes.update(types => {
      const newTypes = new Set(types);
      if (newTypes.has(typeId)) {
        newTypes.delete(typeId);
      } else {
        newTypes.add(typeId);
      }
      return newTypes;
    });
  }

  /**
   * Check if a project type is selected
   */
  isSelected(typeId: string): boolean {
    return this.selectedTypes().has(typeId);
  }


  /**
   * Generate inquiry message and open contact modal
   */
  generateInquiry(): void {
    const description = this.projectDescription.trim();
    const typesText = this.selectedTypesLabels();
    const hasContent = description.length > 0 || this.selectedTypes().size > 0;

    if (!hasContent) {
      // Nothing provided - use a default message
      this.modalService.openContactModal({
        generatedMessage: 'I would like to discuss a potential project.',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
      return;
    }

    let generatedMessage = '';
    
    if (description && typesText) {
      // Both description and types provided
      generatedMessage = `Project Description: ${description}\n\nProject Type(s): ${typesText}`;
    } else if (description) {
      // Only description provided
      generatedMessage = `Project Description: ${description}`;
    } else if (typesText) {
      // Only project types provided
      generatedMessage = `Project Type(s): ${typesText}`;
    }

    this.modalService.openContactModal({
      generatedMessage,
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
  }

  /**
   * Handle input pointer move with throttling for performance
   */
  onInputPointerMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.inputGlowStyle.update(style => ({
      ...style,
      '--px': `${x}px`,
      '--py': `${y}px`
    }));
  }

  /**
   * Handle input enter (hover start)
   */
  onInputEnter(): void {
    this.inputGlowStyle.update(style => ({ 
      ...style, 
      '--hover': '1' 
    }));
  }

  /**
   * Handle input leave (hover end)
   */
  onInputLeave(): void {
    this.inputGlowStyle.update(style => ({ 
      ...style, 
      '--hover': '0' 
    }));
  }
}

