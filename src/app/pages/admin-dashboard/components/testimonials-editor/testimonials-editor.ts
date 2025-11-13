import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, TestimonialContent } from '../../../../services/content.service';
import { CustomDropdownComponent, DropdownOption } from '../services-editor/custom-dropdown/custom-dropdown';

@Component({
  selector: 'app-testimonials-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent],
  templateUrl: './testimonials-editor.html',
  styleUrl: './testimonials-editor.scss'
})
export class TestimonialsEditorComponent {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() testimonials: TestimonialContent[] = [];
  @Output() testimonialsUpdated = new EventEmitter<TestimonialContent[]>();

  selectedTestimonialId: string = '';
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

  onTestimonialSelect(value: string): void {
    if (!value || value === '' || !value.trim()) {
      this.selectedTestimonialId = '';
      this.editingTestimonial = null;
      this.cdr.markForCheck();
      return;
    }

    this.selectedTestimonialId = value.trim();
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

  async saveTestimonial(): Promise<void> {
    if (!this.editingTestimonial) return;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.contentService.updateTestimonialContent(this.editingTestimonial).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'Testimonial saved successfully!';
          if (result.data) {
            const index = this.testimonials.findIndex(t => t.id === result.data!.id);
            if (index >= 0) {
              this.testimonials[index] = result.data;
            } else {
              this.testimonials.push(result.data);
            }
            this.testimonials.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            this.testimonialsUpdated.emit([...this.testimonials]);
          }
          // Keep the testimonial selected after save
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save testimonial';
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving testimonial:', error);
        this.error = 'Failed to save testimonial';
        this.saving = false;
      }
    });
  }
}

