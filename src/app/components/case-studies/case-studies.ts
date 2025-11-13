import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent, Project } from './project-card/project-card';
import { ContentService, ProjectContent } from '../../services/content.service';

@Component({
  selector: 'app-case-studies',
  imports: [RouterLink, ProjectCardComponent],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.scss'
})
export class CaseStudiesComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  
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
  
  originalProjects: Project[] = [
    {
      type: 'tierro',
      title: 'Building a Custom Music Platform from Scratch',
      description: 'Full-scale digital brand for music producer Tierro. Custom website, integrated music player, brand identity, and backend systems built end to end.',
      logoUrl: 'assets/images/projects/project-logo-tierro.svg',
      img: {
        src: 'assets/images/projects/project-card-tierro-img-1.webp',
        alt: 'Tierro project image',
      },
      backgroundImages: [
        'assets/images/projects/project-card-tierro-img-2.svg',
      ],
      link: '/projects'
    },
    {
      type: 'prompt-management',
      title: 'Complete Prompt Management Solution',
      description: 'Built a personal prompt library extension for ChatGPT. Custom UI/UX design and full development to organize and manage prompts efficiently.',
      logoUrl: 'assets/images/projects/project-logo-p.webp',
      img: {
        src: 'assets/images/projects/project-card-p-img-1.webp',
        alt: 'Prompt management project image',
      },
      link: '/projects'
    },
    {
      type: 'landerx',
      title: 'End-to-End SaaS Platform for Marketing',
      description: 'Co-founded and developed an AI-powered marketing platform. Automated workflows generate high-performance landing pages, content, and campaigns for small business clients.',
      logoUrl: 'assets/images/projects/project-logo-landerx.svg',
      img: {
        src: 'assets/images/projects/project-card-landerx-img-1.webp',
        alt: 'Landerx project image',
      },
      link: '/projects'
    },
    {
      type: 'brush along',
      title: 'Interactive Brushing Tracker for Children',
      description: 'Created an engaging game app that turns dental care into play. Helps parents track progress while keeping children motivated and consistent.',
      logoUrl: 'assets/images/projects/project-logo-brushalong.webp',
      img: {
        src: 'assets/images/projects/project-card-brushalong-img-1.webp',
        alt: 'Brush along project image',
      },
      link: '/projects'
    }
  ];

  get projects(): Project[] {
    return this.displayedProjects;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Load projects from database
    this.loadProjectsFromDatabase();
    
    // Initialize with 7 cards: [3 buffer left] + [1 center] + [3 buffer right]
    this.initializeCarousel();
    
    // Only start autoplay in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to let the view initialize
      setTimeout(() => {
        this.startAutoPlay();
      }, 100);
    }
  }

  private loadProjectsFromDatabase(): void {
    this.contentService.getProjectsContent().subscribe({
      next: (projectsFromDb: ProjectContent[]) => {
        if (projectsFromDb && projectsFromDb.length > 0) {
          // Update originalProjects with data from database
          projectsFromDb.forEach((dbProject) => {
            const existingProject = this.originalProjects.find(
              p => p.type === dbProject.project_id
            );
            
            if (existingProject) {
              // Update existing project with database data
              existingProject.title = dbProject.title || existingProject.title;
              existingProject.description = dbProject.description || existingProject.description;
              
              if (dbProject.logo_url) {
                existingProject.logoUrl = dbProject.logo_url;
              }
              
              if (dbProject.image_src) {
                existingProject.img = {
                  src: dbProject.image_src,
                  alt: dbProject.image_alt || dbProject.title || 'Project image'
                };
              }
              
              if (dbProject.link) {
                existingProject.link = dbProject.link;
              }
            } else {
              // Add new project from database
              const newProject: Project = {
                type: dbProject.project_id,
                title: dbProject.title,
                description: dbProject.description,
                logoUrl: dbProject.logo_url || '',
                img: {
                  src: dbProject.image_src || '',
                  alt: dbProject.image_alt || dbProject.title || 'Project image'
                },
                backgroundImages: dbProject.background_images || [],
                link: dbProject.link || '/projects'
              };
              this.originalProjects.push(newProject);
            }
          });
          
          // Sort by display_order if available
          this.originalProjects.sort((a, b) => {
            const aOrder = projectsFromDb.find(p => p.project_id === a.type)?.display_order || 999;
            const bOrder = projectsFromDb.find(p => p.project_id === b.type)?.display_order || 999;
            return aOrder - bOrder;
          });
          
          // Reinitialize carousel with updated data
          this.initializeCarousel();
        }
      },
      error: (error) => {
        console.error('Error loading projects from database:', error);
        // Continue with hardcoded data if database fails
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

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    event.preventDefault();
    this.currentX = this.getClientX(event);
    this.dragOffset = this.currentX - this.startX;
  }

  onDragEnd(event?: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
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
