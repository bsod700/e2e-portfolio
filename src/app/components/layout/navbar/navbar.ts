import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CtaButtonComponent } from '../../ui';

/**
 * Configuration constants for navbar behavior
 */
const NAVBAR_CONFIG = {
  SCROLL_THRESHOLD: 50,
  NAVBAR_OFFSET: 80,
  SCROLL_DELAY_MS: 100,
  NAVIGATION_SCROLL_DELAY_MS: 500,
  HOME_ROUTE: '/'
} as const;

/**
 * Navbar component that provides navigation and scroll functionality.
 * Features:
 * - Responsive mobile menu
 * - Scroll detection for styling changes
 * - Smooth scrolling to sections
 * - Platform-aware (SSR safe)
 */
@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, CtaButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  /** Whether the user has scrolled past the threshold */
  readonly isScrolled = signal<boolean>(false);

  /** Whether the mobile menu is open */
  readonly menuOpen = signal<boolean>(false);

  /** Platform check for browser-only operations */
  private readonly isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Handles window scroll events to update scrolled state
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const scrolled = window.scrollY > NAVBAR_CONFIG.SCROLL_THRESHOLD;
    if (this.isScrolled() !== scrolled) {
      this.isScrolled.set(scrolled);
    }
  }

  /**
   * Handles window resize events to close mobile menu
   */
  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (this.isBrowser && this.menuOpen()) {
      this.closeMenu();
    }
  }

  /**
   * Toggles the mobile menu open/closed state
   */
  toggleMenu(): void {
    const newState = !this.menuOpen();
    this.menuOpen.set(newState);
    this.updateBodyScrollLock(newState);
  }

  /**
   * Closes the mobile menu
   */
  closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.updateBodyScrollLock(false);
    }
  }

  /**
   * Scrolls to the top of the page, navigating to home if necessary
   * @param event - Optional click event to prevent default behavior
   */
  scrollToTop(event?: Event): void {
    this.preventDefault(event);
    if (!this.isBrowser) return;

    this.closeMenu();

    if (this.isHomeRoute()) {
      this.performScroll(0);
    } else {
      this.navigateAndScroll(() => this.performScroll(0));
    }
  }

  /**
   * Scrolls to a specific section on the page, navigating to home if necessary
   * @param sectionId - The ID of the section to scroll to
   * @param event - Optional click event to prevent default behavior
   */
  scrollToSection(sectionId: string, event?: Event): void {
    this.preventDefault(event);
    if (!this.isBrowser) return;

    this.closeMenu();

    if (this.isHomeRoute()) {
      this.scrollToElement(sectionId, NAVBAR_CONFIG.SCROLL_DELAY_MS);
    } else {
      this.navigateAndScroll(() => {
        this.scrollToElement(sectionId, NAVBAR_CONFIG.NAVIGATION_SCROLL_DELAY_MS);
      });
    }
  }

  /**
   * Checks if the current route is the home page
   */
  private isHomeRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === NAVBAR_CONFIG.HOME_ROUTE || currentUrl === '';
  }

  /**
   * Prevents default event behavior if event is provided
   */
  private preventDefault(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Updates the body scroll lock class based on menu state
   */
  private updateBodyScrollLock(lock: boolean): void {
    if (!this.isBrowser) return;

    if (lock) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  /**
   * Performs smooth scroll to a specific position
   */
  private performScroll(top: number): void {
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }

  /**
   * Scrolls to an element by ID with offset calculation
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
        elementPosition + window.pageYOffset - NAVBAR_CONFIG.NAVBAR_OFFSET;

      this.performScroll(offsetPosition);
    }, delay);
  }

  /**
   * Navigates to home route and executes a callback after navigation
   */
  private navigateAndScroll(callback: () => void): void {
    this.router.navigate([NAVBAR_CONFIG.HOME_ROUTE]).then(
      () => callback(),
      (error) => {
        console.error('Navigation failed:', error);
      }
    );
  }
}
