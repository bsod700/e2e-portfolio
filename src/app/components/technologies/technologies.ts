import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Technology {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-technologies',
  imports: [CommonModule],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss'
})
export class TechnologiesComponent {
  isAnimationPaused = false;

  technologies: Technology[] = [
    { icon: '⚛️', name: 'React' },
    { icon: '🅰️', name: 'Angular' },
    { icon: '💚', name: 'Node.js' },
    { icon: '🔷', name: 'TypeScript' },
    { icon: '🟨', name: 'JavaScript' },
    { icon: '🎨', name: 'Figma' },
    { icon: '🐍', name: 'Python' },
    { icon: '🔥', name: 'Firebase' },
    { icon: '☁️', name: 'AWS' },
    { icon: '🐳', name: 'Docker' },
    { icon: '📊', name: 'MongoDB' },
    { icon: '🐘', name: 'PostgreSQL' },
    { icon: '🚀', name: 'Next.js' },
    { icon: '💎', name: 'Redux' },
    { icon: '🎯', name: 'GraphQL' },
    { icon: '🔗', name: 'REST APIs' },
    { icon: '🤖', name: 'AI/ML' },
    { icon: '🎭', name: 'Jest' },
    { icon: '📱', name: 'React Native' },
    { icon: '🌐', name: 'WebSockets' },
    { icon: '🎪', name: 'Webpack' },
    { icon: '📦', name: 'NPM' },
    { icon: '🔧', name: 'Git' },
    { icon: '🎬', name: 'CI/CD' }
  ];

  // Split technologies into two rows
  get firstRowTechnologies(): Technology[] {
    return this.technologies.slice(0, 12);
  }

  get secondRowTechnologies(): Technology[] {
    return this.technologies.slice(12, 24);
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
