import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, HomePageContent } from '../../../../../services/content.service';

@Component({
  selector: 'app-hero-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-editor.html',
  styleUrl: './hero-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroEditorComponent {
  private readonly contentService = inject(ContentService);

  @Input() content: HomePageContent = {
    badge_text: '',
    hero_title: '',
    hero_description: ''
  };

  @Output() contentSaved = new EventEmitter<HomePageContent>();

  saving = false;
  error = '';
  successMessage = '';

  previewTitle(): string {
    return (this.content.hero_title || '').replace(/\n/g, '<br>');
  }

  saveContent(): void {
    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.contentService.updateHomePageContent(this.content).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'Hero content saved successfully!';
          if (result.data) {
            this.contentSaved.emit(result.data);
          }
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save content';
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving content:', error);
        this.error = 'Failed to save content';
        this.saving = false;
      }
    });
  }
}

