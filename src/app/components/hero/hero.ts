import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInquiryComponent } from '../project-inquiry/project-inquiry';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ProjectInquiryComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit {
  private contentService = inject(ContentService);

  badgeText = 'From Vision to Infrastructure';
  heroTitle = 'End-to-End<br>Digital Solutions';
  heroDescription = 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.';

  ngOnInit(): void {
    this.loadContent();
  }

  private loadContent(): void {
    this.contentService.getHomePageContent().subscribe({
      next: (content) => {
        if (content) {
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
