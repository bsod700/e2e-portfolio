import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  role: string;
  initials: string;
  text: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class TestimonialsComponent {
  isAnimationPaused = false;

  testimonials: Testimonial[] = [
    {
      name: 'Tye',
      role: 'CEO, Tech Startup',
      initials: 'T',
      text: 'I was amazed at how well Guy delivered, and has a team of skilled problem-solvers who are always one step ahead! Happy to have them on this project!'
    },
    {
      name: 'Elham',
      role: 'Product Manager',
      initials: 'E',
      text: 'Their creativity and efficiency never cease to amaze me. The quality of work and attention to detail is outstanding. Highly recommend!'
    },
    {
      name: 'Johnson',
      role: 'Marketing Director',
      initials: 'J',
      text: 'Working with Guy has been a game-changer for our business. The solutions delivered exceeded our expectations and the communication was excellent throughout.'
    },
    {
      name: 'Olivia',
      role: 'Startup Founder',
      initials: 'O',
      text: 'Exceptional work! Guy understood our vision perfectly and brought it to life with modern technologies and best practices. Couldn\'t be happier!'
    },
    {
      name: 'Marcus',
      role: 'CTO, FinTech',
      initials: 'M',
      text: 'The technical expertise and problem-solving skills are top-notch. Our project was completed on time and the results speak for themselves.'
    },
    {
      name: 'Sarah',
      role: 'Design Lead',
      initials: 'S',
      text: 'Amazing collaboration! Guy bridges the gap between design and development seamlessly. The final product was pixel-perfect and performant.'
    }
  ];

  // Split testimonials into two rows
  get firstRowTestimonials(): Testimonial[] {
    return this.testimonials.slice(0, 3);
  }

  get secondRowTestimonials(): Testimonial[] {
    return this.testimonials.slice(3, 6);
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
