import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Configuration constants for technologies component behavior
 */
const TECHNOLOGIES_CONFIG = {
  SCROLL_OFFSET: 80,
  SCROLL_DELAY_MS: 100,
  NAVIGATION_SCROLL_DELAY_MS: 500,
  HOME_ROUTE: '/',
  CONTACT_SECTION_ID: 'contact',
  CARD_WIDTH: 50,
  CARD_GAP: 8,
  RIPPLE_COUNT: 10
} as const;

/**
 * Technology interface representing a technology item
 */
interface Technology {
  icon: string;
  name: string;
}

/**
 * Tooltip data interface
 */
interface TooltipData {
  name: string;
  x: number;
  y: number;
}

/**
 * Technologies component that displays an animated carousel of technology icons.
 * Features:
 * - Converging animation from both sides
 * - Interactive tooltips on hover
 * - Animation pause/resume controls
 * - Smooth scrolling to contact section
 * - Platform-aware (SSR safe)
 */
@Component({
  selector: 'app-technologies',
  imports: [CommonModule],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologiesComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  /** Platform check for browser-only operations */
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);

  /** Whether the animation is currently paused */
  readonly isAnimationPaused = signal<boolean>(false);

  /** Active tooltip data, null when no tooltip is shown */
  readonly activeTooltip = signal<TooltipData | null>(null);

  /** Array of technology items to display */
  readonly technologies: Technology[] = [
    { icon: 'assets/images/technologies/tech-react.svg', name: 'React' },
    { icon: 'assets/images/technologies/tech-angular.svg', name: 'Angular' },
    { icon: 'assets/images/technologies/tech-node.svg', name: 'Node.js' },
    { icon: 'assets/images/technologies/tech-figma.svg', name: 'Figma' },
    { icon: 'assets/images/technologies/tech-firebase.svg', name: 'Firebase' },
    { icon: 'assets/images/technologies/tech-aws.svg', name: 'AWS' },
    { icon: 'assets/images/technologies/tech-docker.svg', name: 'Docker' },
    { icon: 'assets/images/technologies/tech-mongodb.svg', name: 'MongoDB' },
    { icon: 'assets/images/technologies/tech-postgresql.svg', name: 'PostgreSQL' },
    { icon: 'assets/images/technologies/tech-next.svg', name: 'Next.js' },
    { icon: 'assets/images/technologies/tech-redux.svg', name: 'Redux' },
    { icon: 'assets/images/technologies/tech-graphql.svg', name: 'GraphQL' },
    { icon: 'assets/images/technologies/tech-webpack.svg', name: 'Webpack' },
    { icon: 'assets/images/technologies/tech-git.svg', name: 'Git' },
    { icon: 'assets/images/technologies/tech-vercel.svg', name: 'Vercel' },
    { icon: 'assets/images/technologies/tech-electron.svg', name: 'Electron' },
    { icon: 'assets/images/technologies/tech-elastic.svg', name: 'Elastic' },
    { icon: 'assets/images/technologies/tech-cursor.svg', name: 'Cursor' },
    { icon: 'assets/images/technologies/tech-framer.svg', name: 'Framer' },
    { icon: 'assets/images/technologies/tech-illustrator.svg', name: 'Illustrator' },
    { icon: 'assets/images/technologies/tech-photoshop.svg', name: 'Photoshop' },
    { icon: 'assets/images/technologies/tech-mixpanel.svg', name: 'Mixpanel' },
    { icon: 'assets/images/technologies/tech-n8n.svg', name: 'n8n' },
    { icon: 'assets/images/technologies/tech-supabase.svg', name: 'Supabase' }
  ];

  /** Array of numbers for ripple animation circles */
  readonly rippleArray: readonly number[] = Array.from(
    { length: TECHNOLOGIES_CONFIG.RIPPLE_COUNT },
    (_, i) => i + 1
  );

  /**
   * Split technologies into left side for converging animation
   */
  get leftSideTechnologies(): Technology[] {
    return this.technologies.slice(0, Math.ceil(this.technologies.length / 2));
  }

  /**
   * Split technologies into right side for converging animation
   */
  get rightSideTechnologies(): Technology[] {
    return this.technologies.slice(Math.ceil(this.technologies.length / 2));
  }

  /**
   * Get duplicated technologies for seamless infinite scroll (original + duplicate)
   */
  get leftSideTechnologiesDuplicated(): Technology[] {
    const left = this.leftSideTechnologies;
    return [...left, ...left];
  }

  /**
   * Get duplicated technologies for seamless infinite scroll (original + duplicate)
   */
  get rightSideTechnologiesDuplicated(): Technology[] {
    const right = this.rightSideTechnologies;
    return [...right, ...right];
  }

  /**
   * Calculate animation distance for left side dynamically
   */
  get leftAnimationDistance(): string {
    const { CARD_WIDTH, CARD_GAP } = TECHNOLOGIES_CONFIG;
    const count = this.leftSideTechnologies.length;
    const distance = CARD_WIDTH * count + CARD_GAP * count;
    return `-${distance}px`;
  }

  /**
   * Calculate animation distance for right side dynamically
   */
  get rightAnimationDistance(): string {
    const { CARD_WIDTH, CARD_GAP } = TECHNOLOGIES_CONFIG;
    const count = this.rightSideTechnologies.length;
    const distance = CARD_WIDTH * count + CARD_GAP * count;
    return `-${distance}px`;
  }

  /**
   * Toggles the animation pause state
   */
  toggleAnimation(): void {
    this.isAnimationPaused.update((paused) => !paused);
  }

  /**
   * Pauses the animation
   */
  pauseAnimation(): void {
    this.isAnimationPaused.set(true);
  }

  /**
   * Resumes the animation
   */
  resumeAnimation(): void {
    this.isAnimationPaused.set(false);
  }

  /**
   * Shows tooltip for a technology item
   * @param event - Mouse event from the technology card
   * @param techName - Name of the technology to display
   */
  showTooltip(event: MouseEvent, techName: string): void {
    if (!this.isBrowser) return;

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    this.activeTooltip.set({
      name: techName,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  }

  /**
   * Hides the active tooltip
   */
  hideTooltip(): void {
    this.activeTooltip.set(null);
  }

  /**
   * Handles document scroll events to hide tooltip
   */
  @HostListener('document:scroll', [])
  onScroll(): void {
    if (this.activeTooltip()) {
      this.activeTooltip.set(null);
    }
  }

  /**
   * Scrolls to the contact section smoothly
   * @param event - Click event to prevent default behavior
   */
  scrollToContact(event: Event): void {
    this.preventDefault(event);
    if (!this.isBrowser) return;

    this.scrollToSection(TECHNOLOGIES_CONFIG.CONTACT_SECTION_ID);
  }

  /**
   * Scrolls to a specific section on the page, navigating to home if necessary
   * @param sectionId - The ID of the section to scroll to
   */
  private scrollToSection(sectionId: string): void {
    if (this.isHomeRoute()) {
      this.scrollToElement(sectionId, TECHNOLOGIES_CONFIG.SCROLL_DELAY_MS);
    } else {
      this.navigateAndScroll(() => {
        this.scrollToElement(sectionId, TECHNOLOGIES_CONFIG.NAVIGATION_SCROLL_DELAY_MS);
      });
    }
  }

  /**
   * Checks if the current route is the home page
   */
  private isHomeRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === TECHNOLOGIES_CONFIG.HOME_ROUTE || currentUrl === '';
  }

  /**
   * Prevents default event behavior and stops propagation
   */
  private preventDefault(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
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
        elementPosition + window.pageYOffset - TECHNOLOGIES_CONFIG.SCROLL_OFFSET;

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
    this.router.navigate([TECHNOLOGIES_CONFIG.HOME_ROUTE]).then(
      () => callback(),
      (error) => {
        console.error('Navigation failed:', error);
      }
    );
  }
}
