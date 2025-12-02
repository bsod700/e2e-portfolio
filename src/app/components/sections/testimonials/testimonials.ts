import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService, TestimonialContent } from '../../../services/content.service';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

type ScrollDirection = 'scroll-left' | 'scroll-right';

interface CarouselCard {
  key: string;
  testimonial: Testimonial;
}

interface CarouselRow {
  id: string;
  direction: ScrollDirection;
  testimonials: Testimonial[];
  showRating: boolean;
  cards: CarouselCard[];
}

// Fallback testimonials - readonly constant for immutability
const FALLBACK_TESTIMONIALS: readonly Testimonial[] = [
  {
    name: 'Dor',
    role: 'CEO, Pointline',
    avatar: 'assets/images/testimonials/avatar-dor.webp',
    text: 'I was amazed at how well Guy delivered, and has a team of skilled problem-solvers who are always one step ahead! Happy to have them on this project!'
  },
  {
    name: 'Sherry',
    role: 'Head of Marketing Strategy, Lempert',
    avatar: 'assets/images/testimonials/avatar-sherry.webp',
    text: 'Their creativity and efficiency never cease to amaze me. The quality of work and attention to detail is outstanding. Highly recommend!'
  },
  {
    name: 'Oded',
    role: 'CEO, WeRlive',
    avatar: 'assets/images/testimonials/avatar-oded.webp',
    text: 'Working with Guy has been a game-changer for our business. The solutions delivered exceeded our expectations and the communication was excellent throughout.'
  },
  {
    name: 'Assaf',
    role: 'Founder, Netyon',
    avatar: 'assets/images/testimonials/avatar-assaf.webp',
    text: 'Exceptional work! Guy understood our vision perfectly and brought it to life with modern technologies and best practices. Couldn\'t be happier!'
  },
  {
    name: 'Marcus',
    role: 'CTO, FinTech',
    avatar: 'assets/images/testimonials/avatar-marcus.webp',
    text: 'The technical expertise and problem-solving skills are top-notch. Our project was completed on time and the results speak for themselves.'
  },
  {
    name: 'Sarah',
    role: 'Design Lead',
    avatar: 'assets/images/testimonials/avatar-sarah.webp',
    text: 'Amazing collaboration! Guy bridges the gap between design and development seamlessly. The final product was pixel-perfect and performant.'
  }
] as const;

// Number of copies for seamless infinite scroll (3 sets ensures smooth looping)
const NUM_COPIES = 3;

/**
 * Converts database testimonial content to component testimonial format
 */
function mapTestimonialContentToTestimonial(dbTestimonial: TestimonialContent): Testimonial {
  return {
    name: dbTestimonial.name,
    role: dbTestimonial.role,
    text: dbTestimonial.text,
    avatar: dbTestimonial.avatar
  };
}

/**
 * Creates carousel cards from testimonials with multiple copies for seamless infinite scrolling
 * Creates enough copies to ensure smooth looping without gaps
 */
function createCarouselCards(testimonials: readonly Testimonial[]): CarouselCard[] {
  const cards: CarouselCard[] = [];
  
  // Create multiple copies of all testimonials
  for (let copyIndex = 0; copyIndex < NUM_COPIES; copyIndex++) {
    testimonials.forEach((testimonial, index) => {
      cards.push({
        key: `${testimonial.name}_copy_${copyIndex}_${index}`,
        testimonial
      });
    });
  }
  
  return cards;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent {
  private readonly contentService = inject(ContentService);

  // Convert observable to signal for reactive state management
  private readonly testimonialsFromDb = toSignal(
    this.contentService.getTestimonialsContent(),
    { initialValue: [] }
  );

  // Reactive state using signals
  // Start paused by default; user can explicitly enable the marquee animation.
  readonly isAnimationPaused = signal(true);
  readonly ratingStars = [1, 2, 3, 4, 5] as const;

  // Computed signal for testimonials - uses database data or fallback
  readonly testimonials = computed<readonly Testimonial[]>(() => {
    const dbTestimonials = this.testimonialsFromDb();
    
    if (!dbTestimonials || dbTestimonials.length === 0) {
      return FALLBACK_TESTIMONIALS;
    }

    // Sort by display_order and map to component format
    return dbTestimonials
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map(mapTestimonialContentToTestimonial);
  });

  // Computed signal for carousel rows - memoized and only recalculates when testimonials change
  readonly carouselRows = computed<readonly CarouselRow[]>(() => {
    const testimonials = this.testimonials();
    
    if (testimonials.length === 0) {
      return [];
    }

    // Split testimonials into two rows for bidirectional scrolling
    // Ensure both rows have content for smooth animation
    const midpoint = Math.ceil(testimonials.length / 2);
    const firstRowTestimonials = testimonials.slice(0, midpoint);
    const secondRowTestimonials = testimonials.slice(midpoint);

    // If second row is empty (edge case), use all testimonials for both rows
    const secondRow = secondRowTestimonials.length > 0 
      ? secondRowTestimonials 
      : firstRowTestimonials;

    const rows: Omit<CarouselRow, 'cards'>[] = [
      {
        id: 'row-1',
        direction: 'scroll-left',
        testimonials: firstRowTestimonials,
        showRating: false
      },
      {
        id: 'row-2',
        direction: 'scroll-right',
        testimonials: secondRow,
        showRating: true
      }
    ];

    return rows.map((row) => ({
      ...row,
      cards: createCarouselCards(row.testimonials)
    }));
  });

  toggleAnimation(): void {
    this.isAnimationPaused.update((paused) => !paused);
  }

  pauseAnimation(): void {
    this.isAnimationPaused.set(true);
  }

  resumeAnimation(): void {
    this.isAnimationPaused.set(false);
  }
}
