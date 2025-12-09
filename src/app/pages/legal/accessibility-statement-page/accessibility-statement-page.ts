import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/layout';
import { LegalPageContent, LegalPageSection } from '../../../services/content.service';
import { take } from 'rxjs/operators';

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
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly cacheKey = 'legal_page_accessibility_statement';

  legalContent: LegalPageContent | null = null;
  lastUpdated = '';
  loading = false;

  get sections(): LegalPageSection[] {
    return this.legalContent?.sections || [];
  }

  ngOnInit(): void {
    // Get resolved data from route using observable to handle async resolution
    this.route.data.pipe(take(1)).subscribe({
      next: (data) => {
        const resolvedContent = data['legalContent'] as LegalPageContent | null;
        
        if (resolvedContent) {
          this.legalContent = resolvedContent;
          this.lastUpdated = this.formatLastUpdated(resolvedContent.last_updated);
          this.saveToCache(resolvedContent);
        } else {
          // Fallback: try to load from cache if resolver didn't provide data
          this.tryLoadFromCache();
        }
      },
      error: (error) => {
        console.error('Error getting resolved data:', error);
        // Fallback to cache on error
        this.tryLoadFromCache();
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


