import { Component, Input } from '@angular/core';
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
  styleUrl: './project-design-system.scss'
})
export class ProjectDesignSystemComponent {
  @Input() projectDesignSystemData: ProjectDesignSystemData = {
    projectName: '',
    title: '',
    text: '',
    DesignSystemTitle: '',
    systemCards: [],
  };

  // Carousel state
  currentSlide = 0;
  itemsPerView = 3;
  isDragging = false;
  startX = 0;
  currentTranslate = 0;
  prevTranslate = 0;

  // Overlay state
  isOverlayOpen = false;
  overlayImageIndex = 0;
  zoomLevel = 1;
  minZoom = 1;
  maxZoom = 3;
  zoomStep = 0.5;
  
  // Pan/drag state for zoomed image
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  panX = 0;
  panY = 0;
  currentPanX = 0;
  currentPanY = 0;

  get totalSlides(): number {
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
    const percentage = this.currentSlide * -100;
    return `translateX(${percentage}%)`;
  }

  // Touch/Drag handlers for carousel
  onTouchStart(event: TouchEvent | MouseEvent): void {
    this.isDragging = true;
    this.startX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    this.prevTranslate = this.currentSlide * -100;
  }

  onTouchMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    
    const currentX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const diff = currentX - this.startX;
    const slideWidth = window.innerWidth;
    const percentageMoved = (diff / slideWidth) * 100;
    
    this.currentTranslate = this.prevTranslate + percentageMoved;
  }

  onTouchEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    
    // Swipe threshold: 15%
    if (movedBy < -15 && this.canGoNext) {
      this.nextSlide();
    } else if (movedBy > 15 && this.canGoPrev) {
      this.prevSlide();
    }
    
    this.currentTranslate = 0;
    this.prevTranslate = 0;
  }

  // Overlay methods
  openOverlay(index: number): void {
    this.overlayImageIndex = index;
    this.isOverlayOpen = true;
    this.zoomLevel = 1;
    this.resetPan();
    document.body.style.overflow = 'hidden';
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.zoomLevel = 1;
    this.resetPan();
    document.body.style.overflow = '';
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
}
