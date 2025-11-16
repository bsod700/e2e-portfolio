import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/layout';
import { ContentService, LegalPageContent, LegalPageSection } from '../../../services/content.service';

@Component({
  selector: 'app-accessibility-statement-page',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './accessibility-statement-page.html',
  styleUrl: './accessibility-statement-page.scss'
})
export class AccessibilityStatementPageComponent implements OnInit {
  private contentService = inject(ContentService);

  legalContent: LegalPageContent | null = null;
  loading = true;

  get lastUpdated(): string {
    if (this.legalContent?.last_updated) {
      return new Date(this.legalContent.last_updated).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  get sections(): LegalPageSection[] {
    return this.legalContent?.sections || [];
  }

  ngOnInit(): void {
    this.loadContent();
  }

  private loadContent(): void {
    this.contentService.getLegalPageContent('accessibility-statement').subscribe({
      next: (content) => {
        this.legalContent = content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading accessibility statement content:', error);
        this.loading = false;
      }
    });
  }
}

