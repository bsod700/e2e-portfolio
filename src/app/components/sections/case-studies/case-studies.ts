import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent, Project } from './project-card/project-card';
import { ProjectsService } from '../../../services/projects.service';

@Component({
  selector: 'app-case-studies',
  imports: [RouterLink, ProjectCardComponent],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.scss'
})
export class CaseStudiesComponent implements OnInit, OnDestroy {
  private projectsService = inject(ProjectsService);
  
  displayedProjects: Project[] = [];
  displayedIndexMap: number[] = []; // Maps displayedProjects index to originalProjects index
  currentIndex = 0; // Current center position in displayedProjects array
  isHovered = false;
  isTransitioning = false;
  private autoPlayInterval?: ReturnType<typeof setInterval>;
  
  // Drag/Touch support
  isDragging = false;
  private startX = 0;
  private currentX = 0;
  private dragStartTime = 0;
  private dragOffset = 0;
  
  originalProjects: Project[] = [];

  get projects(): Project[] {
    return this.displayedProjects;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Load projects from service
    this.loadProjects();
    
    // Only start autoplay in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to let the view initialize
      setTimeout(() => {
        this.startAutoPlay();
      }, 100);
    }
  }

  private loadProjects(): void {
    // Initialize with default projects first for immediate render
    this.originalProjects = this.projectsService.getDefaultProjects();
    this.initializeCarousel();
    
    // Then load from service (which may include database updates)
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.originalProjects = projects;
        this.initializeCarousel();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Already have default projects, so continue
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    // Clean up any drag event listeners
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.handleGlobalMouseMove);
      document.removeEventListener('mouseup', this.handleGlobalMouseUp);
    }
  }

  private handleGlobalMouseMove = (event: MouseEvent) => {
    this.onDragMove(event);
  };

  private handleGlobalMouseUp = (event: MouseEvent) => {
    this.onDragEnd(event);
  };

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isHovered) {
        this.next();
      }
    }, 10000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  private initializeCarousel(): void {
    const total = this.originalProjects.length; // 5
    // We need enough cards to show 3 in viewport + buffers on both sides
    // Structure: [3 left buffer] [1 left visible] [1 CENTER] [1 right visible] [3 right buffer] = 9 cards
    this.displayedProjects = [];
    this.displayedIndexMap = [];
    
    const bufferSize = 3; // 3 cards buffer on each side
    const startCardIndex = 0; // Which original card to show in center
    
    // Add buffer cards on the left (3 cards before the visible area)
    for (let i = -bufferSize; i <= 3; i++) {
      const index = (startCardIndex + i + total * 10) % total;
      this.displayedProjects.push(this.originalProjects[index]);
      this.displayedIndexMap.push(index);
    }
    
    // Add visible cards: left partial, center, right partial (3 cards)
    for (let i = -1; i <= 1; i++) {
      const index = (startCardIndex + i + total * 10) % total;
      this.displayedProjects.push(this.originalProjects[index]);
      this.displayedIndexMap.push(index);
    }
    
    // Add buffer cards on the right (3 cards after visible area)
    for (let i = 2; i <= bufferSize + 1; i++) {
      const index = (startCardIndex + i) % total;
      this.displayedProjects.push(this.originalProjects[index]);
      this.displayedIndexMap.push(index);
    }
    
    // Set current index to the center card (index 4 in array of 9)
    this.currentIndex = bufferSize + 1; // Position 4 = center
  }

  private getOriginalIndex(displayIndex: number): number {
    // Return the original project index for the given display index
    return this.displayedIndexMap[displayIndex];
  }

  next(steps: number = 1): void {
    if (this.isTransitioning) return;
    
    steps = Math.min(steps, 1); // Only move 1 at a time
    const total = this.originalProjects.length;
    const centerPosition = 4; // Center position in our 9-card array
    this.isTransitioning = true;
    
    // Step 1: Animate slide to the right
    this.currentIndex += steps;
    
    // Step 2: After animation, rebalance the array
    setTimeout(() => {
      this.isTransitioning = false;
      
      // Remove 'steps' cards from the left
      this.displayedProjects.splice(0, steps);
      this.displayedIndexMap.splice(0, steps);
      
      // Add 'steps' new cards to the right
      for (let i = 0; i < steps; i++) {
        // Find what the next card should be
        const lastCardOriginalIndex = this.displayedIndexMap[this.displayedIndexMap.length - 1];
        const nextCardIndex = (lastCardOriginalIndex + 1) % total;
        this.displayedProjects.push(this.originalProjects[nextCardIndex]);
        this.displayedIndexMap.push(nextCardIndex);
      }
      
      // Reset currentIndex back to center position
      this.currentIndex = centerPosition;
    }, 800);
  }

  previous(steps: number = 1): void {
    if (this.isTransitioning) return;
    
    steps = Math.min(steps, 1); // Only move 1 at a time
    const total = this.originalProjects.length;
    const centerPosition = 4; // Center position in our 9-card array
    this.isTransitioning = true;
    
    // Step 1: Animate slide to the left
    this.currentIndex -= steps;
    
    // Step 2: After animation, rebalance the array
    setTimeout(() => {
      this.isTransitioning = false;
      
      // Remove 'steps' cards from the right
      this.displayedProjects.splice(-steps, steps);
      this.displayedIndexMap.splice(-steps, steps);
      
      // Add 'steps' new cards to the left
      for (let i = 0; i < steps; i++) {
        // Find what the previous card should be
        const firstCardOriginalIndex = this.displayedIndexMap[0];
        const prevCardIndex = (firstCardOriginalIndex - 1 + total) % total;
        this.displayedProjects.unshift(this.originalProjects[prevCardIndex]);
        this.displayedIndexMap.unshift(prevCardIndex);
      }
      
      // Reset currentIndex back to center position
      this.currentIndex = centerPosition;
    }, 800);
  }

  goToSlide(targetIndex: number): void {
    if (this.isTransitioning) return;
    
    const currentOriginalIndex = this.getOriginalIndex(this.currentIndex);
    const diff = targetIndex - currentOriginalIndex;
    const total = this.originalProjects.length;
    
    // Calculate shortest path
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

  // Touch/Mouse drag handlers
  onDragStart(event: MouseEvent | TouchEvent): void {
    if (this.isTransitioning) return;
    
    // Don't start drag if clicking on interactive elements (buttons, links, etc.)
    const target = event.target as HTMLElement;
    if (this.isInteractiveElement(target)) {
      return;
    }
    
    this.isDragging = true;
    this.dragStartTime = Date.now();
    this.startX = this.getClientX(event);
    this.currentX = this.startX;
    this.dragOffset = 0;
    
    // Add global listeners for mouse events to track dragging outside carousel
    if (event instanceof MouseEvent && isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.handleGlobalMouseMove);
      document.addEventListener('mouseup', this.handleGlobalMouseUp);
    }
  }

  /**
   * Check if the target element or its parent is an interactive element
   */
  private isInteractiveElement(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    // Check if element itself is interactive
    const tagName = element.tagName.toLowerCase();
    const isInteractiveTag = ['a', 'button', 'input', 'select', 'textarea'].includes(tagName);
    
    if (isInteractiveTag) {
      return true;
    }
    
    // Check if element has role="button" or is inside an interactive element
    const hasButtonRole = element.getAttribute('role') === 'button';
    if (hasButtonRole) {
      return true;
    }
    
    // Check if element is inside a button or link
    const closestInteractive = element.closest('a, button, [role="button"]');
    if (closestInteractive) {
      return true;
    }
    
    // Check if element is inside the CTA button component
    const closestCta = element.closest('app-cta-button, .cta-button');
    if (closestCta) {
      return true;
    }
    
    return false;
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    // Check if we're over an interactive element - if so, cancel drag
    if (event instanceof MouseEvent) {
      const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
      if (this.isInteractiveElement(target)) {
        // Cancel drag if over interactive element
        this.isDragging = false;
        this.dragOffset = 0;
        if (isPlatformBrowser(this.platformId)) {
          document.removeEventListener('mousemove', this.handleGlobalMouseMove);
          document.removeEventListener('mouseup', this.handleGlobalMouseUp);
        }
        return;
      }
    }
    
    event.preventDefault();
    this.currentX = this.getClientX(event);
    this.dragOffset = this.currentX - this.startX;
  }

  onDragEnd(event?: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    // Don't end drag if clicking on interactive elements
    if (event) {
      const target = event.target as HTMLElement;
      if (this.isInteractiveElement(target)) {
        // Reset drag state without triggering carousel movement
        this.isDragging = false;
        this.dragOffset = 0;
        
        // Remove global listeners
        if (isPlatformBrowser(this.platformId)) {
          document.removeEventListener('mousemove', this.handleGlobalMouseMove);
          document.removeEventListener('mouseup', this.handleGlobalMouseUp);
        }
        return;
      }
    }
    
    this.isDragging = false;
    
    // Remove global listeners
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.handleGlobalMouseMove);
      document.removeEventListener('mouseup', this.handleGlobalMouseUp);
    }
    
    const dragDistance = this.currentX - this.startX;
    const threshold = 50; // minimum drag distance to trigger
    
    if (Math.abs(dragDistance) > threshold) {
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
      this.isTransitioning = true;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 300);
    }
    
    // Reset drag offset
    this.dragOffset = 0;
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0;
    }
  }

  get transformStyle(): string {
    // Each slide takes full width + margin (2rem)
    // Calculate based on slide width + gap - updated to match Figma 900px cards
    const slideWidth = 'min(900px, calc(100vw - 160px))';
    
    // Add drag offset during dragging
    if (this.isDragging && this.dragOffset !== 0) {
      return `translateX(calc(-${this.currentIndex} * (${slideWidth} + 2rem) + ${this.dragOffset}px))`;
    }
    
    // Always translate based on currentIndex (normally 3 = centered)
    return `translateX(calc(-${this.currentIndex} * (${slideWidth} + 2rem)))`;
  }

  get activeOriginalIndex(): number {
    // Return which original project is currently centered
    return this.getOriginalIndex(this.currentIndex);
  }
}
