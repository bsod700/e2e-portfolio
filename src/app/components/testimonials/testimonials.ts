import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, TestimonialContent } from '../../services/content.service';

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

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class TestimonialsComponent implements OnInit {
  private contentService = inject(ContentService);
  
  isAnimationPaused = false;
  readonly loopCopies = ['original', 'duplicate'] as const;
  readonly ratingStars = [1, 2, 3, 4, 5];

  // Fallback testimonials if database is empty
  private fallbackTestimonials: Testimonial[] = [
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
  ];

  testimonials: Testimonial[] = [];

  ngOnInit(): void {
    this.loadTestimonialsFromDatabase();
  }

  private loadTestimonialsFromDatabase(): void {
    this.contentService.getTestimonialsContent().subscribe({
      next: (testimonialsFromDb: TestimonialContent[]) => {
        if (testimonialsFromDb && testimonialsFromDb.length > 0) {
          // Convert database testimonials to component format
          this.testimonials = testimonialsFromDb
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((dbTestimonial): Testimonial => ({
              name: dbTestimonial.name,
              role: dbTestimonial.role,
              text: dbTestimonial.text,
              avatar: dbTestimonial.avatar
            }));
        } else {
          // Use fallback if database is empty
          this.testimonials = [...this.fallbackTestimonials];
        }
      },
      error: (error) => {
        console.error('Error loading testimonials from database:', error);
        // Use fallback if database fails
        this.testimonials = [...this.fallbackTestimonials];
      }
    });
  }

  get carouselRows(): CarouselRow[] {
    const midpoint = Math.ceil(this.testimonials.length / 2);
    const rows: Omit<CarouselRow, 'cards'>[] = [
      {
        id: 'row-1',
        direction: 'scroll-left',
        testimonials: this.testimonials.slice(0, midpoint),
        showRating: false
      },
      {
        id: 'row-2',
        direction: 'scroll-right',
        testimonials: this.testimonials.slice(midpoint),
        showRating: true
      }
    ];

    return rows.map((row) => ({
      ...row,
      cards: this.loopCopies.flatMap((copy) =>
        row.testimonials.map((testimonial) => ({
          key: `${testimonial.name}_${copy}`,
          testimonial
        }))
      )
    }));
  }

  toggleAnimation(): void {
    this.isAnimationPaused = !this.isAnimationPaused;
  }

  pauseAnimation(): void {
    this.isAnimationPaused = true;
  }

  resumeAnimation(): void {
    this.isAnimationPaused = false;
  }
}
