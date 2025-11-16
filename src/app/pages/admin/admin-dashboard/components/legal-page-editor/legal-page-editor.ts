import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, LegalPageContent, LegalPageSection } from '../../../../../services/content.service';

@Component({
  selector: 'app-legal-page-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-page-editor.html',
  styleUrl: './legal-page-editor.scss'
})
export class LegalPageEditorComponent {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() legalContent: LegalPageContent | null = null;
  @Input() pageType: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions' = 'accessibility-statement';
  @Output() contentSaved = new EventEmitter<string>();
  @Output() contentError = new EventEmitter<string>();

  editingSectionIndex: number | null = null;
  editingSection: LegalPageSection | null = null;
  newListItem: string = '';
  saving = false;
  error = '';
  successMessage = '';
  hasUnsavedChanges = false;

  get sections(): LegalPageSection[] {
    return this.legalContent?.sections || [];
  }

  get pageName(): string {
    switch (this.pageType) {
      case 'accessibility-statement':
        return 'Accessibility Statement';
      case 'privacy-policy':
        return 'Privacy Policy';
      case 'terms-conditions':
        return 'Terms & Conditions';
      default:
        return 'Legal Page';
    }
  }

  isEditing(index: number): boolean {
    return this.editingSectionIndex === index;
  }

  editLegalSection(index: number): void {
    // If another section is being edited, prompt to save/cancel
    if (this.editingSectionIndex !== null && this.editingSectionIndex !== index) {
      if (this.hasUnsavedChanges) {
        const shouldSave = confirm('You have unsaved changes. Do you want to save before editing another section?');
        if (shouldSave) {
          this.saveSection(this.editingSectionIndex).then(() => {
            this.startEditing(index);
          });
        } else {
          this.cancelEdit();
          this.startEditing(index);
        }
      } else {
        this.cancelEdit();
        this.startEditing(index);
      }
    } else {
      this.startEditing(index);
    }
  }

  private startEditing(index: number): void {
    if (!this.content || index < 0 || index >= this.sections.length) {
      return;
    }

    this.editingSectionIndex = index;
    this.editingSection = { ...this.sections[index] };
    this.newListItem = '';
    this.hasUnsavedChanges = false;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editingSectionIndex = null;
    this.editingSection = null;
    this.newListItem = '';
    this.hasUnsavedChanges = false;
  }

  addLegalListItem(): void {
    if (this.editingSection && this.newListItem.trim()) {
      if (!this.editingSection.list_items) {
        this.editingSection.list_items = [];
      }
      this.editingSection.list_items.push(this.newListItem.trim());
      this.newListItem = '';
      this.hasUnsavedChanges = true;
    }
  }

  removeLegalListItem(itemIndex: number): void {
    if (this.editingSection?.list_items) {
      this.editingSection.list_items.splice(itemIndex, 1);
      this.hasUnsavedChanges = true;
    }
  }

  onSectionFieldChange(): void {
    this.hasUnsavedChanges = true;
  }

  async saveSection(index: number): Promise<void> {
    if (!this.content || !this.editingSection || this.editingSectionIndex !== index) {
      return;
    }

    // Update the section in the content
    this.sections[index] = { ...this.editingSection };
    
    // Save the entire page
    await this.saveLegalPage();
  }

  async saveLegalPage(): Promise<void> {
    if (!this.content) {
      this.error = 'No content found for this page';
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    // Ensure page_type is set
    const contentToSave: LegalPageContent = {
      ...this.content,
      page_type: this.pageType
    };

    this.contentService.updateLegalPageContent(contentToSave).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.legalContent = result.data;
          this.successMessage = 'Content saved successfully!';
          this.hasUnsavedChanges = false;
          if (this.editingSectionIndex !== null) {
            // Keep editing the same section after save
            this.editingSection = { ...this.sections[this.editingSectionIndex] };
          }
          this.contentSaved.emit('Legal page content saved successfully!');
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save content';
          this.contentError.emit(this.error);
        }
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while saving';
        this.contentError.emit(this.error);
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  addLegalSection(): void {
    if (!this.content) {
      return;
    }

    const newSection: LegalPageSection = {
      heading: 'New Section',
      content: '',
      list_items: [],
      display_order: (this.content.sections?.length || 0)
    };

    if (!this.content.sections) {
      this.content.sections = [];
    }
    this.content.sections.push(newSection);
    // Start editing the new section
    this.editLegalSection(this.content.sections.length - 1);
  }

  async removeLegalSection(index: number): Promise<void> {
    if (!this.content?.sections || !confirm('Are you sure you want to delete this section?')) {
      return;
    }

    // If the section being deleted is being edited, cancel editing first
    if (this.editingSectionIndex === index) {
      this.cancelEdit();
    } else if (this.editingSectionIndex !== null && this.editingSectionIndex > index) {
      // Adjust editing index if a section before it is deleted
      this.editingSectionIndex--;
    }

    this.content.sections.splice(index, 1);
    
    // Update display_order for remaining sections
    this.content.sections.forEach((section, i) => {
      section.display_order = i;
    });

    // Save after deletion
    await this.saveLegalPage();
  }

  get content(): LegalPageContent | null {
    return this.legalContent;
  }
}


