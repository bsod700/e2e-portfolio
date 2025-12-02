import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, TestimonialContent } from '../../../../../services/content.service';
import { CustomDropdownComponent, DropdownOption } from '../services-editor/custom-dropdown/custom-dropdown';

@Component({
  selector: 'app-testimonials-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent],
  templateUrl: './testimonials-editor.html',
  styleUrl: './testimonials-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsEditorComponent {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() testimonials: TestimonialContent[] = [];
  @Output() testimonialsUpdated = new EventEmitter<TestimonialContent[]>();

  selectedTestimonialId = '';
  editingTestimonial: TestimonialContent | null = null;
  saving = false;
  error = '';
  successMessage = '';

  get dropdownOptions(): DropdownOption[] {
    return this.testimonials.map(testimonial => ({
      value: testimonial.id || '',
      label: testimonial.name || 'Untitled Testimonial'
    }));
  }

  onTestimonialSelect(value: string | null | undefined): void {
    const trimmedValue = (value ?? '').trim();

    if (!trimmedValue) {
      this.selectedTestimonialId = '';
      this.editingTestimonial = null;
      this.cdr.markForCheck();
      return;
    }

    this.selectedTestimonialId = trimmedValue;
    const testimonial = this.testimonials.find(t => t.id === this.selectedTestimonialId);
    
    if (testimonial) {
      this.editingTestimonial = { ...testimonial };
      this.cdr.markForCheck();
    } else {
      this.editingTestimonial = null;
      this.cdr.markForCheck();
    }
  }

  cancelEditTestimonial(): void {
    this.editingTestimonial = null;
    this.selectedTestimonialId = '';
  }

  saveTestimonial(): void {
    if (!this.editingTestimonial) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    this.contentService.updateTestimonialContent(this.editingTestimonial).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.successMessage = 'Testimonial saved successfully!';

          const updated = result.data;
          const index = this.testimonials.findIndex(t => t.id === updated.id);

          let updatedTestimonials: TestimonialContent[];
          if (index >= 0) {
            updatedTestimonials = this.testimonials
              .map((t, i) => (i === index ? updated : t));
          } else {
            updatedTestimonials = [...this.testimonials, updated];
          }

          updatedTestimonials = [...updatedTestimonials].sort(
            (a, b) => (a.display_order || 0) - (b.display_order || 0)
          );

          this.testimonials = updatedTestimonials;
          this.testimonialsUpdated.emit(updatedTestimonials);

          // Keep the testimonial selected after save
          this.selectedTestimonialId = updated.id ?? '';
        } else {
          this.error = result.error || 'Failed to save testimonial';
        }

        this.saving = false;
        this.cdr.markForCheck();

        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.markForCheck();
          }, 3000);
        }
      },
      error: (error) => {
        console.error('Error saving testimonial:', error);
        this.error = 'Failed to save testimonial';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }
}

