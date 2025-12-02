import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  signal,
  effect,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface TocSection {
  id: string;
  title: string;
}

@Component({
  selector: 'app-table-of-contents',
  imports: [CommonModule],
  templateUrl: './table-of-contents.html',
  styleUrl: './table-of-contents.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() sections: TocSection[] = [];

  /**
   * Whether the TOC menu is currently open.
   */
  readonly isOpen = signal(false);

  /**
   * Id of the currently visible section.
   */
  readonly activeSection = signal('');

  /**
   * Whether a drag interaction is currently in progress.
   */
  readonly isDragging = signal(false);

  /**
   * Menu position in viewport percentage.
   * x: 0 = left, 100 = right; y: 0 = top, 100 = bottom.
   */
  readonly position = signal<{ x: number; y: number }>({ x: 0, y: 50 });

  /**
   * Track on which side of the screen the menu is currently snapped.
   */
  readonly isOnRightSide = signal(false);

  private static readonly MIN_DRAG_DISTANCE_PX = 5;
  private static readonly OBSERVER_ROOT_MARGIN = '-20% 0px -60% 0px';
  private static readonly OBSERVER_THRESHOLD = 0;
  private static readonly DOM_READY_TIMEOUT_MS = 100;

  private observer?: IntersectionObserver;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private initialPosition: { x: number; y: number } = { x: 0, y: 50 };
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private pendingRafId: number | null = null;

  constructor() {
    // Auto-scroll active item into view when activeSection changes
    effect(() => {
      const activeSectionId = this.activeSection();
      if (activeSectionId && this.isOpen()) {
        this.scrollActiveItemIntoView(activeSectionId);
      }
    });
  }

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-attach observer if the list of sections changes
    if (changes['sections'] && !changes['sections'].firstChange) {
      this.reObserveSections();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.pendingRafId !== null && this.isBrowser) {
      cancelAnimationFrame(this.pendingRafId);
    }
  }

  toggleMenu() {
    this.isOpen.update((value) => !value);
  }

  scrollToSection(sectionId: string) {
    if (!this.isBrowser) {
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close menu on mobile after clicking
      if (window.innerWidth < 768) {
        this.isOpen.set(false);
      }
    }
  }

  private scrollActiveItemIntoView(sectionId: string) {
    if (!this.isBrowser) {
      return;
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const tocMenu = document.querySelector<HTMLElement>('.toc-menu');
      const activeButton = document.querySelector<HTMLElement>(
        `.toc-link[data-section-id="${sectionId}"]`,
      );

      if (!tocMenu || !activeButton) {
        return;
      }

      const menuRect = tocMenu.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Check if button is outside visible area of menu
      const isAboveView = buttonRect.top < menuRect.top;
      const isBelowView = buttonRect.bottom > menuRect.bottom;

      if (isAboveView || isBelowView) {
        // Scroll the button into view within the menu
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }, TableOfContentsComponent.DOM_READY_TIMEOUT_MS);
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging.set(true);
    this.startX = this.getClientX(event);
    this.startY = this.getClientY(event);
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.initialPosition = { ...this.position() };
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging() || !this.isBrowser) {
      return;
    }

    this.currentX = this.getClientX(event);
    this.currentY = this.getClientY(event);
    const diffX = this.currentX - this.startX;
    const diffY = this.currentY - this.startY;

    // Only start dragging if moved more than minimal distance (to distinguish from clicks)
    if (
      Math.abs(diffX) < TableOfContentsComponent.MIN_DRAG_DISTANCE_PX &&
      Math.abs(diffY) < TableOfContentsComponent.MIN_DRAG_DISTANCE_PX
    ) {
      return;
    }

    // Prevent default only when actually dragging
    event.preventDefault();

    // Throttle updates using requestAnimationFrame to avoid layout thrash
    if (this.pendingRafId !== null) {
      return;
    }

    this.pendingRafId = requestAnimationFrame(() => {
      this.pendingRafId = null;

      // Calculate new position in percentage
      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;

      const deltaXPercent = (diffX / viewportWidth) * 100;
      const deltaYPercent = (diffY / viewportHeight) * 100;

      const newX = Math.max(0, Math.min(100, this.initialPosition.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100, this.initialPosition.y + deltaYPercent));

      this.position.set({ x: newX, y: newY });
    });
  }

  onDragEnd() {
    if (!this.isDragging()) {
      return;
    }

    const diffX = this.currentX - this.startX;
    const diffY = this.currentY - this.startY;

    // If barely moved, treat as click (not drag)
    if (
      Math.abs(diffX) < TableOfContentsComponent.MIN_DRAG_DISTANCE_PX &&
      Math.abs(diffY) < TableOfContentsComponent.MIN_DRAG_DISTANCE_PX
    ) {
      this.isDragging.set(false);
      return;
    }

    // Snap to left or right side based on current position
    const currentPos = this.position();
    const snapToRight = currentPos.x > 50;

    this.position.set({
      x: snapToRight ? 100 : 0,
      y: currentPos.y,
    });

    this.isOnRightSide.set(snapToRight);
    this.isDragging.set(false);
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0]?.clientX || 0;
    }
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientY;
    }

    return event.touches[0]?.clientY || 0;
  }

  private setupIntersectionObserver() {
    // Only run in browser environment
    if (!this.isBrowser) {
      return;
    }

    const options = {
      root: null,
      rootMargin: TableOfContentsComponent.OBSERVER_ROOT_MARGIN,
      threshold: TableOfContentsComponent.OBSERVER_THRESHOLD,
    };

    this.observer?.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    setTimeout(() => this.observeSections(), TableOfContentsComponent.DOM_READY_TIMEOUT_MS);
  }

  private observeSections(): void {
    if (!this.observer || !this.isBrowser) {
      return;
    }

    this.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        this.observer!.observe(element);
      }
    });
  }

  private reObserveSections(): void {
    if (!this.isBrowser) {
      return;
    }

    this.observer?.disconnect();
    this.setupIntersectionObserver();
  }
}

