import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  OnDestroy
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
export class TechnologiesComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  /** Platform check for browser-only operations */
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);

  /** Scroll event throttling */
  private scrollRafId: number | null = null;
  private scrollListener: (() => void) | null = null;

  /** Whether the animation is currently paused */
  readonly isAnimationPaused = signal<boolean>(false);

  /** Active tooltip data, null when no tooltip is shown */
  readonly activeTooltip = signal<TooltipData | null>(null);

  /** Array of technology items to display - readonly to prevent mutations */
  private readonly technologiesData: readonly Technology[] = [
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
  ] as const;

  /** Array of numbers for ripple animation circles - computed once */
  readonly rippleArray: readonly number[] = Array.from(
    { length: TECHNOLOGIES_CONFIG.RIPPLE_COUNT },
    (_, i) => i + 1
  );

  /**
   * Split technologies into left side for converging animation
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly leftSideTechnologies = computed<readonly Technology[]>(() => {
    const midpoint = Math.ceil(this.technologiesData.length / 2);
    return this.technologiesData.slice(0, midpoint);
  });

  /**
   * Split technologies into right side for converging animation
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly rightSideTechnologies = computed<readonly Technology[]>(() => {
    const midpoint = Math.ceil(this.technologiesData.length / 2);
    return this.technologiesData.slice(midpoint);
  });

  /**
   * Get duplicated technologies for seamless infinite scroll (original + duplicate)
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly leftSideTechnologiesDuplicated = computed<readonly Technology[]>(() => {
    const left = this.leftSideTechnologies();
    return [...left, ...left];
  });

  /**
   * Get duplicated technologies for seamless infinite scroll (original + duplicate)
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly rightSideTechnologiesDuplicated = computed<readonly Technology[]>(() => {
    const right = this.rightSideTechnologies();
    return [...right, ...right];
  });

  /**
   * Calculate animation distance for left side dynamically
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly leftAnimationDistance = computed<string>(() => {
    const { CARD_WIDTH, CARD_GAP } = TECHNOLOGIES_CONFIG;
    const count = this.leftSideTechnologies().length;
    const distance = CARD_WIDTH * count + CARD_GAP * count;
    return `-${distance}px`;
  });

  /**
   * Calculate animation distance for right side dynamically
   * Using computed signal to prevent recalculation on every change detection
   */
  readonly rightAnimationDistance = computed<string>(() => {
    const { CARD_WIDTH, CARD_GAP } = TECHNOLOGIES_CONFIG;
    const count = this.rightSideTechnologies().length;
    const distance = CARD_WIDTH * count + CARD_GAP * count;
    return `-${distance}px`;
  });

  constructor() {
    // Setup optimized scroll listener with requestAnimationFrame throttling
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
        if (this.activeTooltip()) {
          this.activeTooltip.set(null);
        }
        this.scrollRafId = null;
      });
    };

    document.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    // Cleanup scroll listener
    if (this.scrollListener && this.isBrowser) {
      document.removeEventListener('scroll', this.scrollListener);
    }
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }
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
   * TrackBy function for technology items to optimize @for loop performance
   * Uses index since arrays are duplicated for infinite scroll, ensuring unique keys
   */
  trackByTechIndex(index: number, tech: Technology): number {
    return index;
  }

  /**
   * TrackBy function for ripple circles to optimize @for loop performance
   */
  trackByRippleIndex(index: number, ripple: number): number {
    return ripple;
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
