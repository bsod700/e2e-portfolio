import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, FAQContent } from '../../../../../services/content.service';

@Component({
  selector: 'app-faq-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq-editor.html',
  styleUrl: './faq-editor.scss'
})
export class FAQEditorComponent {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() faqs: FAQContent[] = [];
  @Output() faqsUpdated = new EventEmitter<FAQContent[]>();

  editingFAQIds: Set<string> = new Set();
  savingIds: Set<string> = new Set();
  deletingIds: Set<string> = new Set();
  error = '';
  successMessage = '';
  draggedIndex: number | null = null;
  dragOverIndex: number | null = null;

  get sortedFAQs(): FAQContent[] {
    return [...this.faqs].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  isEditing(faq: FAQContent): boolean {
    return faq.id ? this.editingFAQIds.has(faq.id) : false;
  }

  isSaving(faq: FAQContent): boolean {
    return faq.id ? this.savingIds.has(faq.id) : false;
  }

  isDeleting(faq: FAQContent): boolean {
    return faq.id ? this.deletingIds.has(faq.id) : false;
  }

  startEdit(faq: FAQContent): void {
    if (faq.id) {
      this.editingFAQIds.add(faq.id);
    }
  }

  cancelEdit(faq: FAQContent): void {
    if (faq.id) {
      this.editingFAQIds.delete(faq.id);
    }
  }

  async saveFAQ(faq: FAQContent): Promise<void> {
    if (!faq.id) return;

    const faqId = faq.id; // Store in constant for type narrowing
    this.savingIds.add(faqId);
    this.error = '';
    this.successMessage = '';

    this.contentService.updateFAQContent(faq).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'FAQ saved successfully!';
          if (result.data) {
            const index = this.faqs.findIndex(f => f.id === result.data!.id);
            if (index >= 0) {
              this.faqs[index] = result.data;
            } else {
              this.faqs.push(result.data);
            }
            this.faqs.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            this.faqsUpdated.emit([...this.faqs]);
          }
          this.editingFAQIds.delete(faqId);
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save FAQ';
        }
        this.savingIds.delete(faqId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error saving FAQ:', error);
        this.error = 'Failed to save FAQ';
        this.savingIds.delete(faqId);
        this.cdr.markForCheck();
      }
    });
  }

  async deleteFAQ(faq: FAQContent): Promise<void> {
    if (!faq.id || !confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    const faqId = faq.id; // Store in constant for type narrowing
    this.deletingIds.add(faqId);
    this.error = '';

    this.contentService.deleteFAQContent(faqId).subscribe({
      next: (result) => {
        if (result.success) {
          const index = this.faqs.findIndex(f => f.id === faqId);
          if (index >= 0) {
            this.faqs.splice(index, 1);
            // Update display_order for remaining FAQs
            this.updateDisplayOrders();
            this.faqsUpdated.emit([...this.faqs]);
            this.successMessage = 'FAQ deleted successfully!';
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        } else {
          this.error = result.error || 'Failed to delete FAQ';
        }
        this.deletingIds.delete(faqId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting FAQ:', error);
        this.error = 'Failed to delete FAQ';
        this.deletingIds.delete(faqId);
        this.cdr.markForCheck();
      }
    });
  }

  addNewFAQ(): void {
    const maxOrder = this.faqs.length > 0 
      ? Math.max(...this.faqs.map(f => f.display_order || 0))
      : -1;
    
    const newFAQ: FAQContent = {
      question: 'New Question',
      answer: 'New Answer',
      is_open: false,
      display_order: maxOrder + 1
    };

    // Save the new FAQ first to get an ID, then start editing
    this.savingIds.add('new');
    this.contentService.updateFAQContent(newFAQ).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.faqs.push(result.data);
          this.faqs.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          this.faqsUpdated.emit([...this.faqs]);
          
          // Start editing the new FAQ immediately
          if (result.data.id) {
            this.editingFAQIds.add(result.data.id);
          }
        } else {
          this.error = result.error || 'Failed to create FAQ';
        }
        this.savingIds.delete('new');
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error creating FAQ:', error);
        this.error = 'Failed to create FAQ';
        this.savingIds.delete('new');
        this.cdr.markForCheck();
      }
    });
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', '');
    }
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverIndex = index;
  }

  onDragLeave(): void {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
      this.draggedIndex = null;
      this.dragOverIndex = null;
      return;
    }

    const sorted = this.sortedFAQs;
    const draggedItem = sorted[this.draggedIndex];
    
    // Remove from old position
    sorted.splice(this.draggedIndex, 1);
    
    // Insert at new position
    sorted.splice(dropIndex, 0, draggedItem);
    
    // Update display_order for all items
    sorted.forEach((faq, index) => {
      faq.display_order = index;
    });

    // Save all FAQs with new order
    this.saveAllFAQs(sorted);
    
    this.draggedIndex = null;
    this.dragOverIndex = null;
    this.cdr.markForCheck();
  }

  private async saveAllFAQs(faqs: FAQContent[]): Promise<void> {
    // Save all FAQs to update their display_order
    const savePromises = faqs.map(faq => {
      return new Promise<void>((resolve) => {
        this.contentService.updateFAQContent(faq).subscribe({
          next: (result) => {
            if (result.success && result.data) {
              const index = this.faqs.findIndex(f => f.id === result.data!.id);
              if (index >= 0) {
                this.faqs[index] = result.data;
              }
            }
            resolve();
          },
          error: () => resolve() // Continue even if one fails
        });
      });
    });

    await Promise.all(savePromises);
    this.faqs.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    this.faqsUpdated.emit([...this.faqs]);
    this.cdr.markForCheck();
  }

  private updateDisplayOrders(): void {
    this.sortedFAQs.forEach((faq, index) => {
      faq.display_order = index;
    });
    this.saveAllFAQs(this.sortedFAQs);
  }
}

