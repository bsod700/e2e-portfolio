import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInquiryComponent } from '../../ui';
import { ContentService } from '../../../services/content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ProjectInquiryComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  private subscription?: Subscription;

  badgeText = 'From Vision to Production';
  heroTitle = 'End-to-End<br>Digital Solutions';
  heroDescription = 'Product design, full-stack engineering, and AI.<br>Web and app products - shipped to production.';

  ngOnInit(): void {
    this.loadContent();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadContent(): void {
    this.subscription = this.contentService.getHomePageContent().subscribe({
      next: (content) => {
        if (content && content.badge_text && content.hero_title && content.hero_description) {
          this.badgeText = content.badge_text;
          this.heroTitle = content.hero_title.replace(/\n/g, '<br>');
          this.heroDescription = content.hero_description.replace(/\n/g, '<br>');
        }
      },
      error: (error) => {
        console.error('Error loading hero content:', error);
      }
    });
  }

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
