import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProjectInquiryComponent } from '../../ui';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ProjectInquiryComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  private readonly contentService = inject(ContentService);

  // Default content for immediate render (fallback)
  private readonly defaultContent = {
    badgeText: 'From Vision to Production',
    heroTitle: 'End-to-End<br>Digital Solutions',
    heroDescription: 'Product design, full-stack engineering, and AI.<br>Web and app products - shipped to production.'
  };

  // Convert observable to signal - non-blocking, reactive, leverages TransferState
  private readonly contentFromDb = toSignal(
    this.contentService.getHomePageContent(),
    { initialValue: null }
  );

  // Computed signal that uses database content or falls back to defaults
  readonly badgeText = computed(() => {
    const content = this.contentFromDb();
    return content?.badge_text || this.defaultContent.badgeText;
  });

  readonly heroTitle = computed(() => {
    const content = this.contentFromDb();
    if (content?.hero_title) {
      return content.hero_title.replace(/\n/g, '<br>');
    }
    return this.defaultContent.heroTitle;
  });

  readonly heroDescription = computed(() => {
    const content = this.contentFromDb();
    if (content?.hero_description) {
      return content.hero_description.replace(/\n/g, '<br>');
    }
    return this.defaultContent.heroDescription;
  });

  scrollToNextSection(): void {
      const nextSection = document.getElementById('services');
      if (nextSection) {
        const elementPosition = nextSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
  }
}
