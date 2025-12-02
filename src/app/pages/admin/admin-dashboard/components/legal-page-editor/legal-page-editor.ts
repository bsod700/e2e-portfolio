import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ContentService, LegalPageContent, LegalPageSection } from '../../../../../services/content.service';
import { DialogService } from '../../../../../services/dialog.service';

@Component({
  selector: 'app-legal-page-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-page-editor.html',
  styleUrl: './legal-page-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageEditorComponent {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);

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
  private lastAddedSectionId: string | null = null;

  @ViewChildren('sectionCard') sectionCards!: QueryList<ElementRef<HTMLElement>>;

  private generateSectionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback UUID-like generator for environments without crypto.randomUUID
    return 'section-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  get sections(): LegalPageSection[] {
    return this.legalContent?.sections ?? [];
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

  get content(): LegalPageContent | null {
    return this.legalContent;
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
          void this.saveSection(this.editingSectionIndex).then(() => {
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
    const sections = this.sections;

    if (!this.content || index < 0 || index >= sections.length) {
      return;
    }

    const section = sections[index];

    this.editingSectionIndex = index;
    this.editingSection = {
      ...section,
      // Always work with a concrete list array while editing
      list_items: section.list_items ? [...section.list_items] : [],
    };
    this.newListItem = '';
    this.hasUnsavedChanges = false;
    this.cdr.markForCheck();
  }

  async cancelEdit(): Promise<void> {
    const currentIndex = this.editingSectionIndex;
    const content = this.content;
    const sections = this.sections;

    if (currentIndex === null) {
      this.editingSection = null;
      this.newListItem = '';
      this.hasUnsavedChanges = false;
      return;
    }

    const currentSection = sections[currentIndex];

    // Case 1: brand-new section, no changes -> remove silently
    const isNewSection =
      !!currentSection &&
      !!this.lastAddedSectionId &&
      currentSection.id === this.lastAddedSectionId;

    const isEmptySection =
      (!currentSection.heading || currentSection.heading === 'New Section') &&
      !currentSection.content &&
      (!currentSection.list_items || currentSection.list_items.length === 0);

    if (content && isNewSection && isEmptySection && !this.hasUnsavedChanges) {
      const updatedSections = sections
        .filter((_, i) => i !== currentIndex)
        .map((section, i) => ({ ...section, display_order: i }));

      this.legalContent = {
        ...content,
        sections: updatedSections,
      };

      this.editingSectionIndex = null;
      this.editingSection = null;
      this.newListItem = '';
      this.hasUnsavedChanges = false;
      this.cdr.markForCheck();
      return;
    }

    // Case 2: there are unsaved changes -> confirm discard
    if (this.hasUnsavedChanges) {
      const confirmDiscard = await this.dialogService.confirm({
        title: isNewSection ? 'Discard new section?' : 'Discard changes?',
        message: isNewSection
          ? 'You have started a new section but haven’t saved it. Do you want to discard this section?'
          : 'You have unsaved changes in this section. Do you want to discard them?',
        confirmLabel: isNewSection ? 'Discard section' : 'Discard changes',
        cancelLabel: 'Keep editing',
        variant: 'danger',
      });

      if (!confirmDiscard) {
        return;
      }

      if (content && isNewSection) {
        // Discard entire new section
        const updatedSections = sections
          .filter((_, i) => i !== currentIndex)
          .map((section, i) => ({ ...section, display_order: i }));

        this.legalContent = {
          ...content,
          sections: updatedSections,
        };
      }
    }

    // Default: exit edit mode and reset local edit state
    this.editingSectionIndex = null;
    this.editingSection = null;
    this.newListItem = '';
    this.hasUnsavedChanges = false;
    this.cdr.markForCheck();
  }

  addLegalListItem(): void {
    const trimmed = this.newListItem.trim();
    if (!this.editingSection || !trimmed) {
      return;
    }

    const list = this.editingSection.list_items ?? [];
    this.editingSection = {
      ...this.editingSection,
      list_items: [...list, trimmed],
    };

    this.newListItem = '';
    this.hasUnsavedChanges = true;
    this.cdr.markForCheck();
  }

  removeLegalListItem(itemIndex: number): void {
    if (!this.editingSection?.list_items) {
      return;
    }

    this.editingSection = {
      ...this.editingSection,
      list_items: this.editingSection.list_items.filter((_, i) => i !== itemIndex),
    };
    this.hasUnsavedChanges = true;
    this.cdr.markForCheck();
  }

  onSectionFieldChange(): void {
    this.hasUnsavedChanges = true;
  }

  async saveSection(index: number): Promise<void> {
    const content = this.content;

    if (!content || !this.editingSection || this.editingSectionIndex !== index) {
      return;
    }

    const sections = [...(content.sections ?? [])];
    if (index < 0 || index >= sections.length) {
      return;
    }

    sections[index] = { ...this.editingSection };
    this.legalContent = {
      ...content,
      sections,
    };

    await this.saveLegalPage();
  }

  async saveLegalPage(): Promise<void> {
    const content = this.content;

    if (!content) {
      this.error = 'No content found for this page';
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    const contentToSave: LegalPageContent = {
      ...content,
      page_type: this.pageType,
    };

    try {
      const result = await firstValueFrom(this.contentService.updateLegalPageContent(contentToSave));

      if (result.success && result.data) {
        this.legalContent = result.data;
        this.successMessage = 'Content saved successfully!';
        this.hasUnsavedChanges = false;

        if (this.editingSectionIndex !== null) {
          // Keep editing the same section after save
          const updatedSections = this.sections;
          if (this.editingSectionIndex >= 0 && this.editingSectionIndex < updatedSections.length) {
            this.editingSection = { ...updatedSections[this.editingSectionIndex] };
          } else {
            this.editingSection = null;
            this.editingSectionIndex = null;
          }
        }

        this.contentSaved.emit('Legal page content saved successfully!');

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      } else {
        this.error = result.error || 'Failed to save content';
        this.contentError.emit(this.error);
      }
    } catch (error: any) {
      this.error = error?.message || 'An error occurred while saving';
      this.contentError.emit(this.error);
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  addLegalSection(): void {
    const existingContent = this.content;

    // Ensure we always have a base LegalPageContent to work with
    const baseContent: LegalPageContent = existingContent ?? {
      page_type: this.pageType,
      title: this.pageName,
      sections: [],
    };

    const currentSections = baseContent.sections ?? [];

    const newSectionId = this.generateSectionId();
    const newSection: LegalPageSection = {
      id: newSectionId,
      heading: 'New Section',
      content: '',
      list_items: [],
      display_order: currentSections.length,
    };

    const updatedSections = [...currentSections, newSection];
    this.legalContent = {
      ...baseContent,
      sections: updatedSections,
    };

    this.hasUnsavedChanges = true;
    this.lastAddedSectionId = newSectionId;
    this.cdr.markForCheck();

    // Start editing the new section
    this.editLegalSection(updatedSections.length - 1);

    // Scroll newly added section into view on next tick
    const newIndex = updatedSections.length - 1;
    setTimeout(() => {
      this.scrollToSection(newIndex);
    });
  }

  private scrollToSection(index: number): void {
    const cards = this.sectionCards?.toArray() ?? [];
    const target = cards[index]?.nativeElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async removeLegalSection(index: number): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Delete section?',
      message: 'This action cannot be undone. Are you sure you want to delete this section?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (!confirmed) {
      return;
    }

    const content = this.content;
    const sections = content?.sections;

    if (!content || !sections) {
      return;
    }

    // If the section being deleted is being edited, cancel editing first
    if (this.editingSectionIndex === index) {
      this.cancelEdit();
    } else if (this.editingSectionIndex !== null && this.editingSectionIndex > index) {
      // Adjust editing index if a section before it is deleted
      this.editingSectionIndex--;
    }

    const updatedSections = sections
      .filter((_, i) => i !== index)
      .map((section, i) => ({
        ...section,
        display_order: i,
      }));

    this.legalContent = {
      ...content,
      sections: updatedSections,
    };

    // Save after deletion
    await this.saveLegalPage();
  }
}


