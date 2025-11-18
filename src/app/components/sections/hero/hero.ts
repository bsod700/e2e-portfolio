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

  badgeText = 'From Vision to Infrastructure';
  heroTitle = 'End-to-End<br>Digital Solutions';
  heroDescription = 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.';

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
          this.heroDescription = content.hero_description;
        }
      },
      error: (error) => {
        console.error('Error loading hero content:', error);
      }
    });
  }
}
