import { Component, Input, OnInit, OnDestroy, signal, effect, PLATFORM_ID, inject } from '@angular/core';
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
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  @Input() sections: TocSection[] = [];
  
  isOpen = signal(false);
  activeSection = signal('');
  isDragging = signal(false);
  position = signal({ x: 0, y: 50 }); // Position in percentage (x: 0 = left, y: 50 = middle)
  isOnRightSide = signal(false); // Track which side of screen we're on

  private observer?: IntersectionObserver;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private initialPosition = { x: 0, y: 50 };
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

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

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleMenu() {
    this.isOpen.update(value => !value);
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
      const tocMenu = document.querySelector('.toc-menu');
      const activeButton = document.querySelector(`.toc-link[data-section-id="${sectionId}"]`);
      
      if (tocMenu && activeButton) {
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
            inline: 'nearest'
          });
        }
      }
    }, 100);
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
    if (!this.isDragging() || !this.isBrowser) return;
    
    this.currentX = this.getClientX(event);
    this.currentY = this.getClientY(event);
    const diffX = this.currentX - this.startX;
    const diffY = this.currentY - this.startY;
    
    // Only start dragging if moved more than 5px (to distinguish from clicks)
    if (Math.abs(diffX) < 5 && Math.abs(diffY) < 5) return;
    
    // Prevent default only when actually dragging
    event.preventDefault();
    
    // Calculate new position in percentage
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const deltaXPercent = (diffX / viewportWidth) * 100;
    const deltaYPercent = (diffY / viewportHeight) * 100;
    
    const newX = Math.max(0, Math.min(100, this.initialPosition.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, this.initialPosition.y + deltaYPercent));
    
    this.position.set({ x: newX, y: newY });
  }

  onDragEnd() {
    if (!this.isDragging()) return;
    
    const diffX = this.currentX - this.startX;
    const diffY = this.currentY - this.startY;
    
    // If barely moved, treat as click (not drag)
    if (Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
      this.isDragging.set(false);
      return;
    }
    
    // Snap to left or right side based on current position
    const currentPos = this.position();
    const snapToRight = currentPos.x > 50;
    
    this.position.set({
      x: snapToRight ? 100 : 0,
      y: currentPos.y
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
    } else {
      return event.touches[0]?.clientY || 0;
    }
  }

  private setupIntersectionObserver() {
    // Only run in browser environment
    if (!this.isBrowser) {
      return;
    }

    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    setTimeout(() => {
      this.sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && this.observer) {
          this.observer.observe(element);
        }
      });
    }, 100);
  }
}

