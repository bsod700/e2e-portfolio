import { ChangeDetectionStrategy, Component, HostListener, Input, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectDesignSystemData {
  projectName: string;
  title: string;
  text: string;
  DesignSystemTitle: string;
  systemCards: {
    image: string;
    title: string;
  }[];
}
@Component({
  selector: 'app-project-design-system',
  imports: [CommonModule],
  templateUrl: './project-design-system.html',
  styleUrl: './project-design-system.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDesignSystemComponent implements AfterViewInit {
  private readonly swipeThreshold = 15; // percentage
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() projectDesignSystemData: ProjectDesignSystemData = {
    projectName: '',
    title: '',
    text: '',
    DesignSystemTitle: '',
    systemCards: [],
  };

  // Carousel state
  currentSlide = 0;
  itemsPerView = 3; // Will be calculated based on screen size
  isDragging = false;
  private startX = 0;
  currentTranslate = 0;
  private prevTranslate = 0;
  private carouselWidth = 0;
  private hasMoved = false;

  // Overlay state
  isOverlayOpen = false;
  overlayImageIndex = 0;
  zoomLevel = 1;
  readonly minZoom = 1;
  readonly maxZoom = 3;
  readonly zoomStep = 0.5;
  
  // Pan/drag state for zoomed image
  isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  panX = 0;
  panY = 0;
  currentPanX = 0;
  currentPanY = 0;

  getItemsPerView(): number {
    if (typeof window === 'undefined') return 3;
    
    const totalCards = this.projectDesignSystemData.systemCards.length;
    
    if (window.innerWidth <= 768) {
      return 1; // Mobile: 1 item per view
    } else if (window.innerWidth <= 1024) {
      return 2; // Tablet: 2 items per view
    }
    
    // Desktop: Show all cards if 4 or fewer, otherwise show 3
    return totalCards <= 4 ? totalCards : 3;
  }

  get totalSlides(): number {
    this.itemsPerView = this.getItemsPerView();
    return Math.ceil(this.projectDesignSystemData.systemCards.length / this.itemsPerView);
  }

  get canGoPrev(): boolean {
    return this.currentSlide > 0;
  }

  get canGoNext(): boolean {
    return this.currentSlide < this.totalSlides - 1;
  }

  // Carousel navigation
  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
    }
  }

  nextSlide(): void {
    if (this.canGoNext) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.canGoPrev) {
      this.currentSlide--;
    }
  }

  getTransform(): string {
    // Calculate items per view based on current screen size
    this.itemsPerView = this.getItemsPerView();
    // Move by full pages (100% of container width per slide)
    const percentage = this.currentSlide * -100;
    return `translateX(${percentage}%)`;
  }

  // Touch/Drag handlers for carousel (touch only)
  onTouchStart(event: TouchEvent): void {
    this.hasMoved = false;
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
    
    // Calculate carousel width if not set
    if (this.carouselWidth === 0 && typeof document !== 'undefined') {
      const carouselElement = document.querySelector('.carousel-container');
      if (carouselElement) {
        this.carouselWidth = carouselElement.clientWidth;
      } else {
        this.carouselWidth = window.innerWidth;
      }
    }
    
    // Calculate the current position in pixels (100% = full container width)
    this.prevTranslate = -(this.currentSlide * this.carouselWidth);
    this.currentTranslate = this.prevTranslate;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    
    const currentX = event.touches[0].clientX;
    const diff = Math.abs(currentX - this.startX);
    
    // Mark as moved if moved more than 5px
    if (diff > 5) {
      this.hasMoved = true;
      event.preventDefault();
    }
    
    // Calculate new position in pixels
    this.currentTranslate = this.prevTranslate + (currentX - this.startX);
    
    // Prevent dragging beyond boundaries
    const minTranslate = -(this.totalSlides - 1) * this.carouselWidth;
    const maxTranslate = 0;
    
    if (this.currentTranslate > maxTranslate) {
      this.currentTranslate = maxTranslate;
    } else if (this.currentTranslate < minTranslate) {
      this.currentTranslate = minTranslate;
    }
  }

  onTouchEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    const threshold = this.carouselWidth * (this.swipeThreshold / 100);
    
    // Determine if we should move to next/prev slide
    if (movedBy < -threshold && this.canGoNext) {
      this.nextSlide();
    } else if (movedBy > threshold && this.canGoPrev) {
      this.prevSlide();
    }
    
    // Reset translate
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    
    // Reset hasMoved after a short delay to allow click event
    setTimeout(() => {
      this.hasMoved = false;
    }, 100);
  }

  // Overlay methods
  openOverlay(index: number): void {
    // Prevent opening overlay if user was dragging
    if (this.hasMoved) {
      return;
    }
    
    this.overlayImageIndex = index;
    this.isOverlayOpen = true;
    this.zoomLevel = 1;
    this.resetPan();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.zoomLevel = 1;
    this.resetPan();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  nextOverlayImage(): void {
    if (this.overlayImageIndex < this.projectDesignSystemData.systemCards.length - 1) {
      this.overlayImageIndex++;
      this.zoomLevel = 1;
      this.resetPan();
    }
  }

  previousOverlayImage(): void {
    if (this.overlayImageIndex > 0) {
      this.overlayImageIndex--;
      this.zoomLevel = 1;
      this.resetPan();
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel += this.zoomStep;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel -= this.zoomStep;
      // Reset pan when zooming out to 1x
      if (this.zoomLevel === 1) {
        this.resetPan();
      }
    }
  }

  resetPan(): void {
    this.panX = 0;
    this.panY = 0;
    this.currentPanX = 0;
    this.currentPanY = 0;
    this.isPanning = false;
  }

  // Pan/drag handlers for zoomed image
  onImagePanStart(event: MouseEvent | TouchEvent): void {
    // Only allow panning when zoomed in
    if (this.zoomLevel <= 1) return;

    event.preventDefault();
    event.stopPropagation();
    
    this.isPanning = true;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    this.panStartX = clientX - this.panX;
    this.panStartY = clientY - this.panY;
  }

  onImagePanMove(event: MouseEvent | TouchEvent): void {
    if (!this.isPanning || this.zoomLevel <= 1) return;

    event.preventDefault();
    event.stopPropagation();
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    this.currentPanX = clientX - this.panStartX;
    this.currentPanY = clientY - this.panStartY;
  }

  onImagePanEnd(): void {
    if (!this.isPanning) return;
    
    this.isPanning = false;
    this.panX = this.currentPanX;
    this.panY = this.currentPanY;
  }

  getImageTransform(): string {
    const scale = `scale(${this.zoomLevel})`;
    const translate = this.zoomLevel > 1 
      ? `translate(${this.isPanning ? this.currentPanX : this.panX}px, ${this.isPanning ? this.currentPanY : this.panY}px)` 
      : '';
    return `${translate} ${scale}`.trim();
  }

  getImageCursor(): string {
    if (this.zoomLevel > 1) {
      return this.isPanning ? 'grabbing' : 'grab';
    }
    return 'default';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('image-overlay')) {
      this.closeOverlay();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOverlayOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeOverlay();
        break;
      case 'ArrowLeft':
        this.previousOverlayImage();
        break;
      case 'ArrowRight':
        this.nextOverlayImage();
        break;
      case '+':
      case '=':
        this.zoomIn();
        break;
      case '-':
      case '_':
        this.zoomOut();
        break;
    }
  }

  ngAfterViewInit(): void {
    // Initialize carousel width after view is initialized
    setTimeout(() => {
      this.updateCarouselWidth();
      this.cdr.markForCheck();
    }, 0);
  }

  private updateCarouselWidth(): void {
    if (typeof document !== 'undefined') {
      const carouselElement = document.querySelector('.carousel-container');
      if (carouselElement) {
        this.carouselWidth = carouselElement.clientWidth;
      }
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Recalculate carousel width on resize
    this.updateCarouselWidth();
    
    // Reset to first slide if current slide is out of bounds after resize
    const newItemsPerView = this.getItemsPerView();
    const newTotalSlides = Math.ceil(this.projectDesignSystemData.systemCards.length / newItemsPerView);
    if (this.currentSlide >= newTotalSlides) {
      this.currentSlide = Math.max(0, newTotalSlides - 1);
      this.cdr.markForCheck();
    }
  }
}
