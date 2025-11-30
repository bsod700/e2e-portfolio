import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent, Project } from './project-card/project-card';
import { ProjectsService } from '../../../services/projects.service';

/**
 * Configuration constants for carousel behavior
 */
const CAROUSEL_CONFIG = {
  BUFFER_SIZE: 3,
  MIN_BUFFER_AHEAD: 4, // Minimum cards ahead to prevent gaps (need more for 3 visible cards)
  CENTER_POSITION: 3,
  ANIMATION_DURATION_MS: 800,
  SNAP_BACK_DURATION_MS: 300,
  DRAG_THRESHOLD: 50,
  AUTO_PLAY_DELAY_MS: 10000,
  INITIALIZATION_DELAY_MS: 100
} as const;

/**
 * Interactive tags that should not trigger carousel drag
 */
const INTERACTIVE_TAGS = ['a', 'button', 'input', 'select', 'textarea'] as const;

/**
 * Case studies carousel component featuring:
 * - Infinite scroll carousel with smooth animations
 * - Always maintains 2+ cards ahead to prevent gaps
 * - Drag and touch support
 * - Auto-play functionality
 * - Platform-aware (SSR safe)
 */
@Component({
  selector: 'app-case-studies',
  imports: [RouterLink, ProjectCardComponent],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseStudiesComponent implements OnInit, OnDestroy {
  private readonly projectsService = inject(ProjectsService);
  private readonly platformId = inject(PLATFORM_ID);

  /** Projects displayed in the carousel (includes buffer cards) */
  readonly displayedProjects = signal<Project[]>([]);

  /** Maps displayedProjects index to originalProjects index */
  readonly displayedIndexMap = signal<number[]>([]);

  /** Current center position in displayedProjects array */
  readonly currentIndex = signal<number>(0);

  /** Whether the carousel is being hovered (pauses auto-play) */
  readonly isHovered = signal<boolean>(false);

  /** Whether a transition animation is in progress */
  readonly isTransitioning = signal<boolean>(false);

  /** Whether a drag operation is in progress */
  readonly isDragging = signal<boolean>(false);

  /** Original projects array from service */
  readonly originalProjects = signal<Project[]>([]);

  private autoPlayInterval?: ReturnType<typeof setInterval>;
  private transitionTimeout?: ReturnType<typeof setTimeout>;
  private startX = 0;
  private currentX = 0;
  private dragStartTime = 0;
  private dragOffset = 0;
  
  /** Getter for template compatibility */
  get projects(): Project[] {
    return this.displayedProjects();
  }

  ngOnInit(): void {
    this.loadProjects();
    
    // Only start autoplay in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Auto-play can be enabled here if needed
      // setTimeout(() => this.startAutoPlay(), CAROUSEL_CONFIG.INITIALIZATION_DELAY_MS);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.cancelTransition();
  }

  /**
   * Loads projects from service, initializing with defaults first for immediate render
   */
  private loadProjects(): void {
    // Initialize with default projects first for immediate render
    const defaultProjects = this.projectsService.getDefaultProjects();
    this.originalProjects.set(defaultProjects);
    this.initializeCarousel();
    
    // Then load from service (which may include database updates)
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.originalProjects.set(projects);
        this.initializeCarousel();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Already have default projects, so continue
      }
    });
  }

  /**
   * Starts auto-play functionality that advances carousel automatically
   */
  startAutoPlay(): void {
    this.stopAutoPlay(); // Clear any existing interval

    this.autoPlayInterval = setInterval(() => {
      if (!this.isHovered()) {
        this.next();
      }
    }, CAROUSEL_CONFIG.AUTO_PLAY_DELAY_MS);
  }

  /**
   * Stops auto-play functionality
   */
  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  /**
   * Handles mouse enter event to pause auto-play
   */
  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  /**
   * Handles mouse leave event to resume auto-play
   */
  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  /**
   * Initializes the carousel with buffer cards for infinite scroll effect
   * Structure: [3 left] [1 CENTER] [5 right] = 9 cards
   * Center position (index 3) shows project index 0 (first project)
   */
  private initializeCarousel(): void {
    const projects = this.originalProjects();
    const total = projects.length;

    if (total === 0) {
      this.displayedProjects.set([]);
      this.displayedIndexMap.set([]);
      this.currentIndex.set(0);
      return;
    }

    const displayed: Project[] = [];
    const indexMap: number[] = [];
    const centerProjectIndex = 0; // Start with first project (index 0) in center

    // Add 3 cards on the left: -3, -2, -1 (wrapped around)
    for (let i = -3; i <= -1; i++) {
      const index = (centerProjectIndex + i + total * 10) % total;
      displayed.push(projects[index]);
      indexMap.push(index);
    }

    // Add center card: project index 0
    displayed.push(projects[centerProjectIndex]);
    indexMap.push(centerProjectIndex);

    // Add 5 cards on the right: 1, 2, 3, 4, 5
    for (let i = 1; i <= 5; i++) {
      const index = (centerProjectIndex + i) % total;
      displayed.push(projects[index]);
      indexMap.push(index);
    }

    this.displayedProjects.set(displayed);
    this.displayedIndexMap.set(indexMap);
    // Set current index to the center card (position 3, showing project index 0)
    this.currentIndex.set(CAROUSEL_CONFIG.CENTER_POSITION);
  }

  /**
   * Gets the original project index for a given display index
   */
  private getOriginalIndex(displayIndex: number): number {
    const indexMap = this.displayedIndexMap();
    return indexMap[displayIndex] ?? 0;
  }

  /**
   * Ensures there are always at least MIN_BUFFER_AHEAD cards ahead of the current position
   * This prevents empty spaces during transitions when moving forward
   */
  private ensureBufferAhead(additionalSteps: number = 0): void {
    const displayed = this.displayedProjects();
    const indexMap = this.displayedIndexMap();
    const projects = this.originalProjects();
    const total = projects.length;
    const currentIdx = this.currentIndex();

    if (total === 0) return;

    // Calculate how many cards are ahead of current position
    // Account for the additional steps we're about to take
    const cardsAhead = displayed.length - currentIdx - 1 - additionalSteps;

    // If we don't have enough buffer ahead, add more cards
    if (cardsAhead < CAROUSEL_CONFIG.MIN_BUFFER_AHEAD) {
      const cardsToAdd = CAROUSEL_CONFIG.MIN_BUFFER_AHEAD - cardsAhead + 2; // +2 for extra safety
      const newDisplayed = [...displayed];
      const newIndexMap = [...indexMap];

      for (let i = 0; i < cardsToAdd; i++) {
        const lastCardOriginalIndex = newIndexMap[newIndexMap.length - 1];
        const nextCardIndex = (lastCardOriginalIndex + 1) % total;
        newDisplayed.push(projects[nextCardIndex]);
        newIndexMap.push(nextCardIndex);
      }

      this.displayedProjects.set(newDisplayed);
      this.displayedIndexMap.set(newIndexMap);
    }
  }

  /**
   * Ensures there are always at least MIN_BUFFER_AHEAD cards behind the current position
   * This prevents empty spaces during transitions when moving backward
   */
  private ensureBufferBehind(): void {
    const displayed = this.displayedProjects();
    const indexMap = this.displayedIndexMap();
    const projects = this.originalProjects();
    const total = projects.length;
    const currentIdx = this.currentIndex();

    if (total === 0) return;

    // Calculate how many cards are behind current position
    const cardsBehind = currentIdx;

    // If we don't have enough buffer behind, add more cards to the left
    if (cardsBehind < CAROUSEL_CONFIG.MIN_BUFFER_AHEAD) {
      const cardsToAdd = CAROUSEL_CONFIG.MIN_BUFFER_AHEAD - cardsBehind + 1; // +1 for safety
      const newDisplayed = [...displayed];
      const newIndexMap = [...indexMap];

      for (let i = 0; i < cardsToAdd; i++) {
        const firstCardOriginalIndex = newIndexMap[0];
        const prevCardIndex = (firstCardOriginalIndex - 1 + total) % total;
        newDisplayed.unshift(projects[prevCardIndex]);
        newIndexMap.unshift(prevCardIndex);
      }

      // Adjust currentIndex since we added cards to the left
      this.currentIndex.set(currentIdx + cardsToAdd);
      this.displayedProjects.set(newDisplayed);
      this.displayedIndexMap.set(newIndexMap);
    }
  }

  /**
   * Moves carousel to the next slide(s)
   * @param steps - Number of steps to move (default: 1, max: 1)
   */
  next(steps: number = 1): void {
    if (this.isTransitioning() && !this.isDragging()) return;
    
    steps = Math.min(steps, 1); // Only move 1 at a time
    const total = this.originalProjects().length;

    if (total === 0) return;

    // Cancel any pending transition
    this.cancelTransition();

    // Ensure we have enough buffer ahead before animating (account for the steps we're about to take)
    this.ensureBufferAhead(steps);

    this.isTransitioning.set(true);
    
    // Step 1: Animate slide to the right
    this.currentIndex.update((idx) => idx + steps);
    
    // Step 2: After animation, rebalance the array
    this.transitionTimeout = setTimeout(() => {
      if (!this.isDragging()) {
        this.rebalanceCarouselRight(steps, total);
        this.currentIndex.set(CAROUSEL_CONFIG.CENTER_POSITION);
        this.isTransitioning.set(false);
      }
      this.transitionTimeout = undefined;
    }, CAROUSEL_CONFIG.ANIMATION_DURATION_MS);
  }

  /**
   * Moves carousel to the previous slide(s)
   * @param steps - Number of steps to move (default: 1, max: 1)
   */
  previous(steps: number = 1): void {
    if (this.isTransitioning() && !this.isDragging()) return;
    
    steps = Math.min(steps, 1); // Only move 1 at a time
    const total = this.originalProjects().length;

    if (total === 0) return;

    // Cancel any pending transition
    this.cancelTransition();

    this.isTransitioning.set(true);

    // Step 1: Animate slide to the left
    this.currentIndex.update((idx) => idx - steps);
    
    // Step 2: After animation, rebalance the array
    this.transitionTimeout = setTimeout(() => {
      if (!this.isDragging()) {
        const displayed = [...this.displayedProjects()];
        const indexMap = [...this.displayedIndexMap()];
        const projects = this.originalProjects();
        
        // Remove 'steps' cards from the right
        displayed.splice(-steps, steps);
        indexMap.splice(-steps, steps);
        
        // Add 'steps' new cards to the left
        for (let i = 0; i < steps; i++) {
          // Find what the previous card should be
          const firstCardOriginalIndex = indexMap[0];
          const prevCardIndex = (firstCardOriginalIndex - 1 + total) % total;
          displayed.unshift(projects[prevCardIndex]);
          indexMap.unshift(prevCardIndex);
        }
        
        this.displayedProjects.set(displayed);
        this.displayedIndexMap.set(indexMap);
        
        // Reset currentIndex back to center position
        this.currentIndex.set(CAROUSEL_CONFIG.CENTER_POSITION);
        this.isTransitioning.set(false);
      }
      this.transitionTimeout = undefined;
    }, CAROUSEL_CONFIG.ANIMATION_DURATION_MS);
  }

  /**
   * Rebalances carousel array after moving right by removing left cards and adding right cards
   */
  private rebalanceCarouselRight(steps: number, total: number): void {
    const displayed = [...this.displayedProjects()];
    const indexMap = [...this.displayedIndexMap()];
    const projects = this.originalProjects();

    // Remove 'steps' cards from the left
    displayed.splice(0, steps);
    indexMap.splice(0, steps);

    // Add 'steps' new cards to the right
    for (let i = 0; i < steps; i++) {
      const lastCardOriginalIndex = indexMap[indexMap.length - 1];
      const nextCardIndex = (lastCardOriginalIndex + 1) % total;
      displayed.push(projects[nextCardIndex]);
      indexMap.push(nextCardIndex);
    }

    this.displayedProjects.set(displayed);
    this.displayedIndexMap.set(indexMap);
  }

  /**
   * Rebalances carousel array after moving left by removing right cards and adding left cards
   */
  private rebalanceCarouselLeft(steps: number, total: number): void {
    const displayed = [...this.displayedProjects()];
    const indexMap = [...this.displayedIndexMap()];
    const projects = this.originalProjects();
      
      // Remove 'steps' cards from the right
    displayed.splice(-steps, steps);
    indexMap.splice(-steps, steps);
      
      // Add 'steps' new cards to the left
      for (let i = 0; i < steps; i++) {
      const firstCardOriginalIndex = indexMap[0];
        const prevCardIndex = (firstCardOriginalIndex - 1 + total) % total;
      displayed.unshift(projects[prevCardIndex]);
      indexMap.unshift(prevCardIndex);
      }
      
    this.displayedProjects.set(displayed);
    this.displayedIndexMap.set(indexMap);
  }

  /**
   * Navigates to a specific slide by index
   * @param targetIndex - The target slide index in originalProjects
   */
  goToSlide(targetIndex: number): void {
    if (this.isTransitioning()) return;

    const total = this.originalProjects().length;
    if (total === 0 || targetIndex < 0 || targetIndex >= total) {
      console.warn(`Invalid target index: ${targetIndex}`);
      return;
    }

    const currentOriginalIndex = this.getOriginalIndex(this.currentIndex());
    const diff = targetIndex - currentOriginalIndex;
    
    // Calculate shortest path (wrap around if going the other way is shorter)
    let steps = diff;
    if (Math.abs(diff) > total / 2) {
      steps = diff > 0 ? diff - total : diff + total;
    }
    
    // Move in the appropriate direction
    if (steps > 0) {
      for (let i = 0; i < Math.abs(steps); i++) {
        this.next(1);
      }
    } else if (steps < 0) {
      for (let i = 0; i < Math.abs(steps); i++) {
        this.previous(1);
      }
    }
  }

  /**
   * Handles drag start event (touch only - no mouse drag on desktop)
   * @param event - Touch event
   */
  onDragStart(event: TouchEvent): void {
    if (this.isTransitioning()) return;
    
    // Don't start drag if clicking on interactive elements (buttons, links, etc.)
    const target = event.target as HTMLElement;
    if (this.isInteractiveElement(target)) {
      return;
    }
    
    this.isDragging.set(true);
    this.dragStartTime = Date.now();
    this.startX = this.getClientX(event);
    this.currentX = this.startX;
    this.dragOffset = 0;
  }

  /**
   * Checks if the target element or its parent is an interactive element
   * @param element - The element to check
   * @returns True if the element is interactive
   */
  private isInteractiveElement(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    // Check if element itself is interactive
    const tagName = element.tagName.toLowerCase();
    const isInteractiveTag = INTERACTIVE_TAGS.includes(
      tagName as (typeof INTERACTIVE_TAGS)[number]
    );
    
    if (isInteractiveTag) {
      return true;
    }
    
    // Check if element has role="button" or is inside an interactive element
    if (element.getAttribute('role') === 'button') {
      return true;
    }
    
    // Check if element is inside a button or link
    if (element.closest('a, button, [role="button"]')) {
      return true;
    }
    
    // Check if element is inside the CTA button component
    if (element.closest('app-cta-button, .cta-button')) {
      return true;
    }
    
    return false;
  }

  /**
   * Handles drag move event (touch only)
   * @param event - Touch event
   */
  onDragMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    
    event.preventDefault();
    this.currentX = this.getClientX(event);
    this.dragOffset = this.currentX - this.startX;
  }

  /**
   * Handles drag end event (touch only)
   * @param event - Optional touch event
   */
  onDragEnd(event?: TouchEvent): void {
    if (!this.isDragging()) return;
    
    // Don't end drag if clicking on interactive elements
    if (event) {
      const target = event.target as HTMLElement;
      if (this.isInteractiveElement(target)) {
        this.cancelDrag();
        return;
      }
    }
    
    this.isDragging.set(false);
    
    const dragDistance = this.currentX - this.startX;
    
    if (Math.abs(dragDistance) > CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      // Move in the direction of the drag (always 1 card)
      if (dragDistance > 0) {
        // Dragged right (go to previous card)
        this.previous(1);
      } else {
        // Dragged left (go to next card)
        this.next(1);
      }
    } else {
      // If drag was too small, snap back with transition
      this.isTransitioning.set(true);
      this.transitionTimeout = setTimeout(() => {
        this.isTransitioning.set(false);
        this.transitionTimeout = undefined;
      }, CAROUSEL_CONFIG.SNAP_BACK_DURATION_MS);
    }
    
    // Reset drag offset
    this.dragOffset = 0;
  }

  /**
   * Gets the client X coordinate from a touch event
   */
  private getClientX(event: TouchEvent): number {
      return event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0;
  }

  /**
   * Cancels the current drag operation
   */
  private cancelDrag(): void {
    this.isDragging.set(false);
    this.dragOffset = 0;
  }

  /**
   * Cancels any ongoing transition
   */
  private cancelTransition(): void {
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = undefined;
    }
    this.isTransitioning.set(false);
  }

  /**
   * Cleans up drag event listeners (no longer needed for touch-only)
   */
  private cleanupDragListeners(): void {
    // No cleanup needed for touch events as they're handled inline
  }

  /**
   * Computes the CSS transform style for the carousel track
   * Uses CSS custom properties for responsive widths and gaps
   * Centers the active card while keeping track at full viewport width
   */
  get transformStyle(): string {
    const currentIdx = this.currentIndex();
    // Center the active card: move left by currentIdx cards, then shift right to center
    const baseTransform = `translateX(calc(-${currentIdx} * (var(--slide-width) + var(--slide-gap)) + (100vw - var(--slide-width)) / 2))`;
    
    // Add drag offset during dragging
    if (this.isDragging() && this.dragOffset !== 0) {
      return `translateX(calc(-${currentIdx} * (var(--slide-width) + var(--slide-gap)) + (100vw - var(--slide-width)) / 2 + ${this.dragOffset}px))`;
    }
    
    return baseTransform;
  }

  /**
   * Returns the index of the currently centered project in originalProjects
   */
  get activeOriginalIndex(): number {
    return this.getOriginalIndex(this.currentIndex());
  }
}

