import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

/**
 * Configuration constants for CTA button behavior
 */
const CTA_BUTTON_CONFIG = {
  SCROLL_OFFSET: 80,
  SCROLL_DELAY_MS: 100,
  NAVIGATION_SCROLL_DELAY_MS: 500,
  HOME_ROUTE: '/',
  DEFAULT_HREF: '/contact',
  DEFAULT_TEXT: "Let's Talk"
} as const;

/**
 * Data interface for CTA button configuration
 */
export interface CtaButtonData {
  text?: string;
  href?: string;
  target?: '_blank' | '_self';
  size?: 'small' | 'default';
  routerLink?: string;
}

/**
 * CTA Button component that provides call-to-action functionality.
 * Features:
 * - Support for router links and external hrefs
 * - Smooth scrolling to hash sections
 * - Platform-aware (SSR safe)
 * - Configurable size and target
 */
@Component({
  selector: 'app-cta-button',
  imports: [CommonModule, RouterLink],
  templateUrl: './cta-button.html',
  styleUrl: './cta-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaButtonComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  /** Button size variant */
  @Input() size: 'small' | 'default' = 'default';

  /** External link URL (used when routerLink is not provided) */
  @Input() href: string = CTA_BUTTON_CONFIG.DEFAULT_HREF;

  /** Button text label */
  @Input() text: string = CTA_BUTTON_CONFIG.DEFAULT_TEXT;

  /** Angular router link (takes precedence over href) */
  @Input() routerLink?: string;

  /** Link target attribute */
  @Input() target: '_blank' | '_self' = '_self';

  /** Event emitted when button is clicked */
  @Output() clicked = new EventEmitter<void>();

  /** Platform check for browser-only operations */
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);

  /**
   * Handles button click events
   * @param event - Click event from the button
   */
  onClick(event: Event): void {
    this.clicked.emit();

    const linkToCheck = this.routerLink || this.href;
    const sectionId = this.extractSectionId(linkToCheck);

    if (sectionId) {
      // Handle hash-based section scrolling
      this.preventDefault(event);
      this.scrollToSection(sectionId);
    } else if (this.routerLink) {
      // Handle Angular router navigation
      this.preventDefault(event);
      this.navigateToRoute(this.routerLink);
    }
    // For regular href links without hash, let browser handle it naturally
  }

  /**
   * Extracts section ID from a URL containing a hash fragment
   * @param url - URL string that may contain a hash
   * @returns Section ID if found, null otherwise
   */
  private extractSectionId(url: string | undefined): string | null {
    if (!url) return null;

    const hashMatch = url.match(/#([^#]+)/);
    return hashMatch ? hashMatch[1] : null;
  }

  /**
   * Scrolls to a specific section on the page, navigating to home if necessary
   * @param sectionId - The ID of the section to scroll to
   */
  private scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;

    if (this.isHomeRoute()) {
      this.scrollToElement(sectionId, CTA_BUTTON_CONFIG.SCROLL_DELAY_MS);
    } else {
      this.navigateAndScroll(() => {
        this.scrollToElement(sectionId, CTA_BUTTON_CONFIG.NAVIGATION_SCROLL_DELAY_MS);
      });
    }
  }

  /**
   * Checks if the current route is the home page
   */
  private isHomeRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === CTA_BUTTON_CONFIG.HOME_ROUTE || currentUrl === '';
  }

  /**
   * Prevents default event behavior and stops propagation
   */
  private preventDefault(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Navigates to a route using Angular router
   * @param route - Route path to navigate to
   */
  private navigateToRoute(route: string): void {
    this.router.navigateByUrl(route).catch((error) => {
      console.error('Navigation error:', error);
    });
  }

  /**
   * Scrolls to an element by ID with offset calculation
   * @param elementId - The ID of the element to scroll to
   * @param delay - Delay in milliseconds before scrolling
   */
  private scrollToElement(elementId: string, delay: number): void {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with ID "${elementId}" not found`);
        return;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - CTA_BUTTON_CONFIG.SCROLL_OFFSET;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, delay);
  }

  /**
   * Navigates to home route and executes a callback after navigation
   * @param callback - Function to execute after navigation completes
   */
  private navigateAndScroll(callback: () => void): void {
    this.router.navigate([CTA_BUTTON_CONFIG.HOME_ROUTE]).then(
      () => callback(),
      (error) => {
        console.error('Navigation failed:', error);
      }
    );
  }
}

