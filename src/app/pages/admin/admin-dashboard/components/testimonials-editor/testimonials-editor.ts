import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, TestimonialContent } from '../../../../../services/content.service';
import { DialogService } from '../../../../../services/dialog.service';

@Component({
  selector: 'app-testimonials-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './testimonials-editor.html',
  styleUrl: './testimonials-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsEditorComponent {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);

  @Input() testimonials: TestimonialContent[] = [];
  @Output() testimonialsUpdated = new EventEmitter<TestimonialContent[]>();

  @ViewChildren('testimonialCard') testimonialCards?: QueryList<ElementRef<HTMLElement>>;

  readonly editingTestimonialIds = new Set<string>();
  readonly savingIds = new Set<string>();
  readonly deletingIds = new Set<string>();
  readonly newTestimonialIds = new Set<string>();
  private readonly originalNewTestimonials = new Map<string, TestimonialContent>();
  error = '';
  successMessage = '';

  get sortedTestimonials(): TestimonialContent[] {
    return [...this.testimonials].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  get previewTestimonial(): TestimonialContent | null {
    const editing = this.sortedTestimonials.find(t => this.isEditing(t));
    return editing ?? null;
  }

  isEditing(testimonial: TestimonialContent): boolean {
    return testimonial.id ? this.editingTestimonialIds.has(testimonial.id) : false;
  }

  isSaving(testimonial: TestimonialContent): boolean {
    return testimonial.id ? this.savingIds.has(testimonial.id) : false;
  }

  isDeleting(testimonial: TestimonialContent): boolean {
    return testimonial.id ? this.deletingIds.has(testimonial.id) : false;
  }

  startEdit(testimonial: TestimonialContent): void {
    if (testimonial.id) {
      this.editingTestimonialIds.add(testimonial.id);
      this.cdr.markForCheck();
    }
  }

  async cancelEdit(testimonial: TestimonialContent): Promise<void> {
    if (!testimonial.id) {
      return;
    }

    const testimonialId = testimonial.id;

    // Special behavior for newly created testimonials
    if (this.newTestimonialIds.has(testimonialId)) {
      const original = this.originalNewTestimonials.get(testimonialId);

      // If we have the original snapshot, compare to see if there were any edits
      const hasChanges = original
        ? this.hasTestimonialChanged(original, testimonial)
        : true;

      if (!hasChanges) {
        // No changes -> silently delete the new testimonial without confirmation
        await this.deleteTestimonial(testimonial, { skipConfirm: true });
        this.newTestimonialIds.delete(testimonialId);
        this.originalNewTestimonials.delete(testimonialId);
        this.editingTestimonialIds.delete(testimonialId);
        return;
      }

      // There are changes -> ask for confirmation before deleting
      const confirmed = await this.dialogService.confirm({
        title: 'Discard changes?',
        message: 'You\'ve made changes to this new testimonial. Do you want to discard it?',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        variant: 'danger',
      });

      if (confirmed) {
        await this.deleteTestimonial(testimonial, { skipConfirm: true });
        this.newTestimonialIds.delete(testimonialId);
        this.originalNewTestimonials.delete(testimonialId);
        this.editingTestimonialIds.delete(testimonialId);
      }

      return;
    }

    // Existing testimonial: just exit edit mode
    this.editingTestimonialIds.delete(testimonialId);
    this.cdr.markForCheck();
  }

  saveTestimonial(testimonial: TestimonialContent): void {
    if (!testimonial.id) return;

    const testimonialId = testimonial.id;
    this.savingIds.add(testimonialId);
    this.error = '';
    this.successMessage = '';

    this.contentService.updateTestimonialContent(testimonial).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'Testimonial saved successfully!';

          if (result.data) {
            const updated = result.data;
            const index = this.testimonials.findIndex(t => t.id === updated.id);

            if (index >= 0) {
              this.testimonials[index] = updated;
            } else {
              this.testimonials.push(updated);
            }

            this.testimonials.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            this.testimonialsUpdated.emit([...this.testimonials]);
          }

          this.editingTestimonialIds.delete(testimonialId);
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.markForCheck();
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save testimonial';
        }

        this.savingIds.delete(testimonialId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error saving testimonial:', error);
        this.error = 'Failed to save testimonial';
        this.savingIds.delete(testimonialId);
        this.cdr.markForCheck();
      }
    });
  }

  async deleteTestimonial(
    testimonial: TestimonialContent,
    options?: { skipConfirm?: boolean }
  ): Promise<void> {
    if (!testimonial.id) {
      return;
    }

    const testimonialId = testimonial.id;

    if (!options?.skipConfirm) {
      const confirmed = await this.dialogService.confirm({
        title: 'Delete testimonial?',
        message: `This will remove "${testimonial.name || 'this testimonial'}" from the testimonials list. This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      });

      if (!confirmed) {
        return;
      }
    }

    this.deletingIds.add(testimonialId);
    this.error = '';

    this.contentService.deleteTestimonialContent(testimonialId).subscribe({
      next: (result) => {
        if (result.success) {
          const index = this.testimonials.findIndex(t => t.id === testimonialId);
          if (index >= 0) {
            this.testimonials.splice(index, 1);
            this.testimonialsUpdated.emit([...this.testimonials]);
            this.successMessage = 'Testimonial deleted successfully!';
            setTimeout(() => {
              this.successMessage = '';
              this.cdr.markForCheck();
            }, 3000);
          }
        } else {
          this.error = result.error || 'Failed to delete testimonial';
        }
        this.deletingIds.delete(testimonialId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting testimonial:', error);
        this.error = 'Failed to delete testimonial';
        this.deletingIds.delete(testimonialId);
        this.cdr.markForCheck();
      }
    });
  }

  addNewTestimonial(): void {
    const maxOrder = this.testimonials.length > 0
      ? Math.max(...this.testimonials.map(t => t.display_order || 0))
      : -1;

    const newTestimonial: TestimonialContent = {
      name: 'New Name',
      role: 'New Role',
      text: 'New testimonial text',
      avatar: '',
      display_order: maxOrder + 1
    };

    this.savingIds.add('new');
    this.contentService.updateTestimonialContent(newTestimonial).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.testimonials.push(result.data);
          this.testimonials.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          this.testimonialsUpdated.emit([...this.testimonials]);

          if (result.data.id) {
            const id = result.data.id;
            this.editingTestimonialIds.add(id);
            this.newTestimonialIds.add(id);
            this.originalNewTestimonials.set(id, { ...result.data });

            // Scroll the newly added testimonial into view on next tick
            setTimeout(() => {
              this.scrollToTestimonial(id);
            });
          }
        } else {
          this.error = result.error || 'Failed to create testimonial';
        }
        this.savingIds.delete('new');
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error creating testimonial:', error);
        this.error = 'Failed to create testimonial';
        this.savingIds.delete('new');
        this.cdr.markForCheck();
      }
    });
  }

  private scrollToTestimonial(id: string): void {
    const cards = this.testimonialCards?.toArray() ?? [];
    const target = cards.find(card => card.nativeElement.dataset['testimonialId'] === id);
    target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private hasTestimonialChanged(original: TestimonialContent, current: TestimonialContent): boolean {
    return (
      original.name !== current.name ||
      original.role !== current.role ||
      original.text !== current.text ||
      original.avatar !== current.avatar
    );
  }
}

