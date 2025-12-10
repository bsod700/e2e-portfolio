import { Component, ChangeDetectionStrategy, signal, PLATFORM_ID, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private scrollRafId: number | null = null;
  private scrollListener: (() => void) | null = null;

  readonly isVisible = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      this.setupScrollListener();
    }
  }

  /**
   * Setup optimized scroll listener using requestAnimationFrame
   */
  private setupScrollListener(): void {
    this.scrollListener = () => {
      if (this.scrollRafId !== null) {
        cancelAnimationFrame(this.scrollRafId);
      }

      this.scrollRafId = requestAnimationFrame(() => {
        const shouldBeVisible = window.scrollY > 300;
        if (this.isVisible() !== shouldBeVisible) {
          this.isVisible.set(shouldBeVisible);
          this.cdr.markForCheck();
        }
        this.scrollRafId = null;
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  ngOnDestroy(): void {
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }
  }
}

