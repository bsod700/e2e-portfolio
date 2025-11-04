import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DesignVisualComponent } from './service-visuals/design-visual/design-visual';
import { DevelopmentVisualComponent } from './service-visuals/development-visual/development-visual';
import { AiAutomationVisualComponent } from './service-visuals/ai-automation-visual/ai-automation-visual';
import { StrategyVisualComponent } from './service-visuals/strategy-visual/strategy-visual';
import { BrandVisualComponent } from './service-visuals/brand-visual/brand-visual';

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  fullDescription: string;
  services: string[];
  benefits: string[];
  codeExample?: string;
}

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    DesignVisualComponent,
    DevelopmentVisualComponent,
    AiAutomationVisualComponent,
    StrategyVisualComponent,
    BrandVisualComponent
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  constructor(private router: Router) {}

  services: Service[] = [
    {
      id: 'design',
      icon: '✨',
      title: 'Digital Product Design',
      description: 'From mobile apps to complex systems, every product is crafted from the ground up - no templates, no shortcuts. Tailored to your goals, built to perform, and designed to stand out.',
      fullDescription: 'I create beautiful, intuitive interfaces that users love. Every design decision is backed by user research and best practices, ensuring your product is not just visually appealing but also highly functional and accessible.',
      services: [
        'UI/UX design & prototyping (Figma, Adobe XD)',
        'User research & persona development',
        'Wireframing & user flow mapping',
        'Responsive & mobile-first design',
        'Design systems & component libraries',
        'Brand identity & visual design',
        'Accessibility compliance (WCAG 2.1)',
        'Usability testing & iteration'
      ],
      benefits: [
        'User-centered design that drives engagement',
        'Consistent brand experience across all touchpoints',
        'Reduced development time with clear specifications',
        'Improved conversion rates and user satisfaction',
        'Accessible to all users, including those with disabilities'
      ]
    },
    {
      id: 'development',
      icon: '</>',
      title: 'FullStack Development',
      description: 'Reliable, high-performance systems built with modern frameworks. From scalable APIs to dynamic front-ends, software engineered to evolve and grow with every business need.',
      fullDescription: 'I specialize in building high-performance web applications using cutting-edge technologies and best practices. From single-page applications to complex full-stack systems, I deliver clean, maintainable code that scales with your business.',
      services: [
        'Full-stack web applications (Angular, React, Node.js)',
        'RESTful API development & integration',
        'Database design & optimization (SQL & NoSQL)',
        'Cloud deployment & DevOps (AWS, Azure, Vercel)',
        'Performance optimization & code review',
        'Progressive Web Apps (PWA)',
        'Real-time applications (WebSockets)',
        'Microservices architecture'
      ],
      benefits: [
        'Clean, maintainable code following best practices',
        'Scalable architecture that grows with your business',
        'Fast performance and optimized load times',
        'Cross-browser compatibility',
        'Comprehensive testing and documentation'
      ],
      codeExample: `// Example: Optimized Angular component
@Component({
  selector: 'app-feature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FeatureComponent {
  data$ = this.service.getData().pipe(
    shareReplay(1),
    catchError(err => this.handleError(err))
  );
}`
    },
    {
      id: 'ai-automation',
      icon: '⚙️',
      title: 'AI Automation',
      description: 'Intelligent workflows that evolve with your business. Custom AI solutions automate tasks, enhance decisions, and create smarter operations.',
      fullDescription: 'Harness the power of artificial intelligence to automate repetitive tasks, enhance user experiences, and gain valuable insights from your data. I integrate modern AI tools and create custom automation workflows that save time and increase efficiency.',
      services: [
        'AI API integration (OpenAI, Anthropic, Google AI)',
        'Custom chatbots & virtual assistants',
        'Workflow automation & process optimization',
        'Natural language processing (NLP)',
        'AI-powered content generation',
        'Intelligent data analysis & insights',
        'Machine learning model integration',
        'Automated testing & quality assurance'
      ],
      benefits: [
        'Reduced manual work and human error',
        'Faster delivery and improved efficiency',
        'Enhanced user experiences with intelligent features',
        'Cost savings through automation',
        'Scalable processes that grow with your needs'
      ]
    },
    {
      id: 'strategy',
      icon: '🎯',
      title: 'Digital Strategy',
      description: 'Data-driven direction that connects design, technology, and growth. Every move focused on clarity, consistency, and measurable results.',
      fullDescription: 'Strategic planning is crucial for successful digital products. I help you define clear goals, choose the right technology stack, and create a roadmap that aligns technical decisions with business objectives.',
      services: [
        'Technical consultation & architecture planning',
        'Technology stack selection',
        'Product roadmap development',
        'Feature prioritization & MVP definition',
        'Performance audit & optimization strategy',
        'Scalability planning',
        'Security assessment & recommendations',
        'Code review & quality assurance'
      ],
      benefits: [
        'Clear technical direction and roadmap',
        'Informed decision-making backed by expertise',
        'Risk mitigation and problem prevention',
        'Optimized resource allocation',
        'Long-term scalability and maintainability'
      ]
    },
    {
      id: 'brand',
      icon: '🎨',
      title: 'Brand Identity',
      description: 'Distinct visuals and language that define who you are. From logo to palette, every element built to express purpose and leave a mark.',
      fullDescription: 'I create distinctive brand identities that communicate your unique value proposition. From logo design to comprehensive brand guidelines, every element is crafted to express your purpose and leave a lasting impression.',
      services: [
        'Logo design & brand identity',
        'Visual language & style guides',
        'Brand strategy & positioning',
        'Color palette & typography systems',
        'Brand guidelines & documentation',
        'Marketing materials & assets',
        'Brand storytelling & messaging',
        'Multi-channel brand consistency'
      ],
      benefits: [
        'Memorable brand that stands out',
        'Consistent visual identity across all touchpoints',
        'Clear brand guidelines for future growth',
        'Professional brand presence',
        'Strong brand recognition and recall'
      ]
    }
  ];

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }
}
