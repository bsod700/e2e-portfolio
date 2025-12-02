import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../../components/layout';
import { ContentService, LegalPageContent, LegalPageSection } from '../../../services/content.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-accessibility-statement-page',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './accessibility-statement-page.html',
  styleUrl: './accessibility-statement-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityStatementPageComponent implements OnInit {
  private readonly isBrowser: boolean;
  private readonly cacheKey = 'legal_page_accessibility_statement';

  legalContent: LegalPageContent | null = null;
  lastUpdated = '';
  loading = true;

  constructor(
    private readonly contentService: ContentService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get sections(): LegalPageSection[] {
    return this.legalContent?.sections || [];
  }

  ngOnInit(): void {
    this.tryLoadFromCache();
    this.loadContent();
  }

  private loadContent(): void {
    this.contentService
      .getLegalPageContent('accessibility-statement')
      .pipe(take(1))
      .subscribe({
        next: (content) => {
          if (!content) {
            this.loading = false;
            return;
          }

          const isNewContent =
            !this.legalContent ||
            this.legalContent.updated_at !== content.updated_at ||
            this.legalContent.last_updated !== content.last_updated;

          if (isNewContent) {
            this.legalContent = content;
            this.lastUpdated = this.formatLastUpdated(content.last_updated);
            this.saveToCache(content);
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading accessibility statement content:', error);
          this.loading = false;
        }
      });
  }

  private tryLoadFromCache(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(this.cacheKey);
      if (!raw) {
        return;
      }

      const cached = JSON.parse(raw) as LegalPageContent | null;
      if (!cached) {
        return;
      }

      this.legalContent = cached;
      this.lastUpdated = this.formatLastUpdated(cached.last_updated);
      this.loading = false;
    } catch (error) {
      console.error('Error reading accessibility statement from cache:', error);
    }
  }

  private saveToCache(content: LegalPageContent): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(this.cacheKey, JSON.stringify(content));
    } catch (error) {
      console.error('Error saving accessibility statement to cache:', error);
    }
  }

  private formatLastUpdated(lastUpdated?: string | Date | null): string {
    const date = lastUpdated != null ? new Date(lastUpdated) : new Date();

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}


