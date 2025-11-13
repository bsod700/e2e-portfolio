import { Component, HostListener } from '@angular/core';
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
  activeTooltip: { name: string; x: number; y: number } | null = null;

  technologies: Technology[] = [
    { icon: 'assets/images/technologies/tech-react.svg', name: 'React' },
    { icon: 'assets/images/technologies/tech-angular.svg', name: 'Angular' },
    { icon: 'assets/images/technologies/tech-node.svg', name: 'Node.js' },
    { icon: 'assets/images/technologies/tech-typescript.svg', name: 'TypeScript' },
    { icon: 'assets/images/technologies/tech-javascript.svg', name: 'JavaScript' },
    { icon: 'assets/images/technologies/tech-figma.svg', name: 'Figma' },
    { icon: 'assets/images/technologies/tech-firebase.svg', name: 'Firebase' },
    { icon: 'assets/images/technologies/tech-aws.svg', name: 'AWS' },
    { icon: 'assets/images/technologies/tech-docker.svg', name: 'Docker' },
    { icon: 'assets/images/technologies/tech-mongodb.svg', name: 'MongoDB' },
    { icon: 'assets/images/technologies/tech-postgresql.svg', name: 'PostgreSQL' },
    { icon: 'assets/images/technologies/tech-next.svg', name: 'Next.js' },
    { icon: 'assets/images/technologies/tech-redux.svg', name: 'Redux' },
    { icon: 'assets/images/technologies/tech-graphql.svg', name: 'GraphQL' },
    { icon: 'assets/images/technologies/tech-webpack.svg', name: 'Webpack' },
    { icon: 'assets/images/technologies/tech-npm.svg', name: 'NPM' },
    { icon: 'assets/images/technologies/tech-git.svg', name: 'Git' },
    { icon: 'assets/images/technologies/tech-html.svg', name: 'HTML' },
    { icon: 'assets/images/technologies/tech-css.svg', name: 'CSS' },
    { icon: 'assets/images/technologies/tech-sass.svg', name: 'SASS' },
    { icon: 'assets/images/technologies/tech-tailwindcss.svg', name: 'Tailwind CSS' },
    { icon: 'assets/images/technologies/tech-redis.svg', name: 'Redis' },
    { icon: 'assets/images/technologies/tech-vercel.svg', name: 'Vercel' },
    { icon: 'assets/images/technologies/tech-cloudflare.svg', name: 'Cloudflare' },
    { icon: 'assets/images/technologies/tech-nginx.svg', name: 'Nginx' },
    { icon: 'assets/images/technologies/tech-electron.svg', name: 'Electron' },
    { icon: 'assets/images/technologies/tech-elastic.svg', name: 'Elastic' },
    { icon: 'assets/images/technologies/tech-cursor.svg', name: 'Cursor' },
    { icon: 'assets/images/technologies/tech-framer.svg', name: 'Framer' },
    { icon: 'assets/images/technologies/tech-illustrator.svg', name: 'Illustrator' },
    { icon: 'assets/images/technologies/tech-photoshop.svg', name: 'Photoshop' },
    { icon: 'assets/images/technologies/tech-gitlab.svg', name: 'GitLab' },
    { icon: 'assets/images/technologies/tech-visualstudio.svg', name: 'Visual Studio' },
    { icon: 'assets/images/technologies/tech-atlassian.svg', name: 'Atlassian' },
    { icon: 'assets/images/technologies/tech-trello.svg', name: 'Trello' },
    { icon: 'assets/images/technologies/tech-slack.svg', name: 'Slack' },
    { icon: 'assets/images/technologies/tech-gmail.svg', name: 'Gmail' },
    { icon: 'assets/images/technologies/tech-meta.svg', name: 'Meta' },
    { icon: 'assets/images/technologies/tech-posthog.svg', name: 'PostHog' },
    { icon: 'assets/images/technologies/tech-mixpanel.svg', name: 'Mixpanel' },
    { icon: 'assets/images/technologies/tech-perplexity.svg', name: 'Perplexity' },
    { icon: 'assets/images/technologies/tech-airtable.svg', name: 'Airtable' },
    { icon: 'assets/images/technologies/tech-n8n.svg', name: 'n8n' }
  ];

  // Split technologies into two sides for converging animation
  get leftSideTechnologies(): Technology[] {
    return this.technologies.slice(0, Math.ceil(this.technologies.length / 2));
  }

  get rightSideTechnologies(): Technology[] {
    return this.technologies.slice(Math.ceil(this.technologies.length / 2));
  }

  // Get duplicated technologies for seamless infinite scroll (original + duplicate)
  get leftSideTechnologiesDuplicated(): Technology[] {
    const left = this.leftSideTechnologies;
    return [...left, ...left];
  }

  get rightSideTechnologiesDuplicated(): Technology[] {
    const right = this.rightSideTechnologies;
    return [...right, ...right];
  }

  // Calculate animation distance dynamically
  get leftAnimationDistance(): string {
    const cardWidth = 50;
    const gap = 8;
    const count = this.leftSideTechnologies.length;
    const distance = (cardWidth * count) + (gap * count);
    return `-${distance}px`;
  }

  get rightAnimationDistance(): string {
    const cardWidth = 50;
    const gap = 8;
    const count = this.rightSideTechnologies.length;
    const distance = (cardWidth * count) + (gap * count);
    return `-${distance}px`;
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

  showTooltip(event: MouseEvent, techName: string): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.activeTooltip = {
      name: techName,
      x: rect.left + rect.width / 2,
      y: rect.top
    };
  }

  hideTooltip(): void {
    this.activeTooltip = null;
  }

  @HostListener('document:scroll')
  onScroll(): void {
    // Hide tooltip on scroll
    if (this.activeTooltip) {
      this.activeTooltip = null;
    }
  }

  // Generate array for ripple circles
  get rippleArray(): number[] {
    return [1, 2, 3, 4,5,6,7,8,9,10];
  }

}
