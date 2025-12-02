import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  ElementRef,
  QueryList,
  ViewChildren,
  signal,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContentService, FAQContent } from '../../../services/content.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

/**
 * FAQ component featuring:
 * - Accordion-style FAQ display
 * - Smooth height animations
 * - Database-driven content with fallback
 * - Performance optimized with OnPush change detection
 */
@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  private rafId: number | null = null;

  @ViewChildren('detailsWrapper') detailsWrappers!: QueryList<ElementRef<HTMLDivElement>>;

  /** FAQs displayed in the component */
  private readonly _faqs = signal<FAQ[]>([]);

  /** Getter for template compatibility */
  get faqs(): FAQ[] {
    return this._faqs();
  }

  // Fallback FAQs if database is empty
  private readonly fallbackFAQs: FAQ[] = [
    {
      question: "What's the typical project scope?",
      answer: "I take on full-cycle product builds that include UX, interface design, frontend and backend development, and automation. The focus is always on delivering complete, polished, and scalable digital solutions.",
      isOpen: true
    },
    {
      question: "Can you work with existing code or designs?",
      answer: "Yes, absolutely. I can seamlessly integrate with your existing codebase, design systems, or design files. Whether you need enhancements, refactoring, or building new features on top of existing work, I adapt to your current setup and maintain consistency with your established patterns.",
      isOpen: false
    },
    {
      question: "Do you handle everything in-house?",
      answer: "Yes, I handle the full product lifecycle in-house. From initial concept and UX design to frontend and backend development, AI integration, and deployment—everything is managed by me. This ensures consistency, faster iteration, and a unified vision throughout the project.",
      isOpen: false
    },
    {
      question: "Do you offer support after launch?",
      answer: "Yes, I provide ongoing support and maintenance after launch. This includes bug fixes, performance optimizations, feature updates, and technical assistance. I'm committed to ensuring your product continues to run smoothly and evolves with your business needs.",
      isOpen: false
    },
    {
      question: "Can you integrate AI or automate processes?",
      answer: "Definitely. I specialize in integrating AI capabilities and automation workflows into digital products. This includes LLM integration, RAG pipelines, vector databases, chatbots, recommendation systems, and custom automation solutions that streamline operations and enhance user experiences.",
      isOpen: false
    }
  ];

  ngOnInit(): void {
    this.loadFAQsFromDatabase();
  }

  ngAfterViewInit(): void {
    // Set initial heights for open FAQs using requestAnimationFrame for better performance
    this.scheduleHeightUpdate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up any pending animation frames (only in browser)
    if (isPlatformBrowser(this.platformId) && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Schedules a height update using requestAnimationFrame for optimal performance
   */
  private scheduleHeightUpdate(): void {
    // Only use requestAnimationFrame in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR, update heights directly without animation frame
      this.updateHeights();
      return;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.updateHeights();
      this.rafId = null;
    });
  }

  /**
   * Updates the height of FAQ detail wrappers based on their open state
   */
  private updateHeights(): void {
    if (!this.detailsWrappers || this.detailsWrappers.length === 0) {
      return;
    }

    const currentFaqs = this._faqs();
    this.detailsWrappers.forEach((wrapper, index) => {
      const element = wrapper.nativeElement;
      const details = element.querySelector('.faq-details') as HTMLElement;
      
      if (details && currentFaqs[index]) {
        if (currentFaqs[index].isOpen) {
          element.style.height = `${details.scrollHeight}px`;
        } else {
          element.style.height = '0px';
        }
      }
    });
  }

  /**
   * Loads FAQs from the database or uses fallback data
   */
  private loadFAQsFromDatabase(): void {
    this.contentService.getFAQContent()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (faqsFromDb: FAQContent[]) => {
          let processedFaqs: FAQ[];

          if (faqsFromDb && faqsFromDb.length > 0) {
            // Convert database FAQs to component format
            processedFaqs = faqsFromDb
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
              .map((dbFAQ, index): FAQ => ({
                question: dbFAQ.question,
                answer: dbFAQ.answer,
                // Only first FAQ should be open by default (accordion behavior)
                isOpen: index === 0 && (dbFAQ.is_open !== false)
              }));
          } else {
            // Use fallback if database is empty
            processedFaqs = [...this.fallbackFAQs];
          }

          this._faqs.set(processedFaqs);
          this.cdr.markForCheck();
          
          // Update heights after data is loaded
          this.scheduleHeightUpdate();
        },
        error: (error) => {
          console.error('Error loading FAQs from database:', error);
          // Use fallback if database fails
          this._faqs.set([...this.fallbackFAQs]);
          this.cdr.markForCheck();
          
          // Update heights after fallback is set
          this.scheduleHeightUpdate();
        }
      });
  }

  /**
   * Toggles the FAQ accordion state (only one open at a time)
   * @param index - The index of the FAQ to toggle
   */
  toggleFaq(index: number): void {
    const currentFaqs = this._faqs();
    const clickedFaq = currentFaqs[index];
    
    if (!clickedFaq) {
      return;
    }

    const wasOpen = clickedFaq.isOpen;
    
    // Close all FAQs first
    const updatedFaqs = currentFaqs.map((faq) => ({
      ...faq,
      isOpen: false
    }));
    
    // If the clicked FAQ wasn't open, open it now (accordion behavior)
    if (!wasOpen) {
      updatedFaqs[index] = { ...clickedFaq, isOpen: true };
    }

    this._faqs.set(updatedFaqs);
    this.cdr.markForCheck();

    // Recalculate all heights based on the new open/closed state
    this.scheduleHeightUpdate();
  }
}