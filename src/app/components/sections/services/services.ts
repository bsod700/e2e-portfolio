import { Component, OnInit, inject, OnDestroy, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContentService, ServicesSectionHeader, HomeServiceCard } from '../../../services/content.service';
import { DesignVisualComponent } from './service-visuals/design-visual/design-visual';
import { DevelopmentVisualComponent } from './service-visuals/development-visual/development-visual';
import { AiAutomationVisualComponent } from './service-visuals/ai-automation-visual/ai-automation-visual';
import { StrategyVisualComponent } from './service-visuals/strategy-visual/strategy-visual';
import { BrandVisualComponent } from './service-visuals/brand-visual/brand-visual';

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  services: string[];
  benefits: string[];
  codeExample?: string;
  image?: string;
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
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  private readonly contentService = inject(ContentService);

  // Default header content for immediate render (fallback)
  private readonly defaultHeader = {
    kicker: "Product design • Full-stack • AI",
    title: 'Everything needed to ship a digital product',
    description: 'A complete service stack: design, full-stack development, AI automation, strategy, and brand identity.'
  };

  // Convert observables to signals - non-blocking, reactive, leverages TransferState
  private readonly headerFromDb = toSignal(
    this.contentService.getServicesSectionHeader(),
    { initialValue: null }
  );

  private readonly homeServicesFromDb = toSignal(
    this.contentService.getHomeServicesSection(),
    { initialValue: [] }
  );

  // Computed signals for header content
  readonly servicesKicker = computed(() => {
    const header = this.headerFromDb();
    return header?.kicker || this.defaultHeader.kicker;
  });

  readonly servicesTitle = computed(() => {
    const header = this.headerFromDb();
    return header?.title || this.defaultHeader.title;
  });

  readonly servicesDescription = computed(() => {
    const header = this.headerFromDb();
    return header?.description || this.defaultHeader.description;
  });

  cardGlowStyles: { [key: string]: { [key: string]: string } } = {};
  shouldShowImageDevice = false;
  showVisuals: { [key: string]: boolean } = {};
  
  private interactiveEnabled = false;
  private rafId: number | null = null;
  private mobileQuery?: MediaQueryList;
  private touchQuery?: MediaQueryList;
  private mobileQueryHandler?: (e: MediaQueryListEvent | MediaQueryList) => void;
  private touchQueryHandler?: (e: MediaQueryListEvent | MediaQueryList) => void;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.initializeCardStyles();
    this.setupDeviceDetection();
    this.setupInteractiveDetection();
    this.updateVisualStates();
  }

  private initializeCardStyles(): void {
    this.services().forEach(service => {
      this.cardGlowStyles[service.id] = {
        '--px': '-1000px',
        '--py': '-1000px',
        '--hover': '0'
      };
    });
  }

  private setupInteractiveDetection(): void {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    this.interactiveEnabled = mq.matches;
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      this.interactiveEnabled = e.matches;
      if (!e.matches) this.resetHoverStates();
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange as EventListener);
    } else if (mq.addListener) {
      mq.addListener(handleChange);
    }
  }

  private resetHoverStates(): void {
    this.services().forEach(service => {
      this.cardGlowStyles[service.id] = {
        ...this.cardGlowStyles[service.id],
        '--px': '-1000px',
        '--py': '-1000px',
        '--hover': '0',
        '--dx': '0',
        '--dy': '0'
      };
    });
  }

  // Computed signal for services - merges default services with database updates
  readonly services = computed<ServiceOffering[]>(() => {
    const dbServices = this.homeServicesFromDb();
    const defaultServices = [...this.defaultServices];
    
    // Update default services with database content if available
    if (dbServices && dbServices.length > 0) {
      dbServices.forEach(card => {
        const existingService = defaultServices.find(s => s.id === card.service_id);
        if (existingService) {
          if (card.title) existingService.title = card.title;
          if (card.description) existingService.description = card.description;
        }
      });
    }
    
    return defaultServices;
  });

  // Default services array (used as base for computed signal)
  private readonly defaultServices: ServiceOffering[] = [
    {
      id: 'design',
      title: 'Digital Product Design',
      description: 'Smart, scalable product design built from scratch for your business.',
      image: 'assets/images/service-digital-product-design.webp',
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
      title: 'FullStack Development',
      description: 'Reliable, high-performance systems built with modern frameworks. From scalable APIs to dynamic front-ends, software engineered to evolve and grow with every business need.',
      image: 'assets/images/service-fullstack-development.webp',
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
      title: 'AI Automation',
      description: 'Intelligent workflows that evolve with your business. Custom AI solutions automate tasks, enhance decisions, and create smarter operations.',
      image: 'assets/images/service-ai-automation.webp',
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
      title: 'Digital Strategy',
      description: 'Data-driven direction that connects design, technology, and growth. Every move focused on clarity, consistency, and measurable results.',
      image: 'assets/images/service-digital-strategy.webp',
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
      title: 'Brand Identity',
      description: 'Distinct visuals and language that define who you are. From logo to palette, every element built to express purpose and leave a mark.',
      image: 'assets/images/service-brand-identity.webp',
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

  onCardPointerMove(event: MouseEvent, serviceId: string): void {
    if (!this.interactiveEnabled) return;
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    
    // Capture values immediately before RAF
    const rect = target.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) * 100) / 100; // Round to 2 decimal places
    const y = Math.round((event.clientY - rect.top) * 100) / 100; // Round to 2 decimal places
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ndx = Math.round(Math.max(-1, Math.min(1, (x - cx) / cx)) * 1000) / 1000; // Round to 3 decimal places
    const ndy = Math.round(Math.max(-1, Math.min(1, (y - cy) / cy)) * 1000) / 1000; // Round to 3 decimal places
    
    // Cancel previous animation frame if pending
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Throttle updates using requestAnimationFrame (limits to ~60fps)
    this.rafId = requestAnimationFrame(() => {
      this.cardGlowStyles[serviceId] = {
        ...this.cardGlowStyles[serviceId],
        '--px': `${x}px`,
        '--py': `${y}px`,
        '--dx': `${ndx}`,
        '--dy': `${ndy}`
      };
      this.rafId = null;
    });
  }

  onCardEnter(serviceId: string): void {
    if (!this.interactiveEnabled) return;
    this.cardGlowStyles[serviceId] = { ...this.cardGlowStyles[serviceId], '--hover': '1' };
  }

  onCardLeave(serviceId: string): void {
    if (!this.interactiveEnabled) return;
    this.cardGlowStyles[serviceId] = { 
      ...this.cardGlowStyles[serviceId], 
      '--hover': '0',
      '--dx': '0',
      '--dy': '0'
    };
  }

  onCardEnterDesktop(serviceId: string): void {
    if (!this.shouldShowImageDevice) {
      this.showVisuals[serviceId] = true;
    }
    this.onCardEnter(serviceId);
  }

  onCardLeaveDesktop(serviceId: string): void {
    this.onCardLeave(serviceId);
  }

  private setupDeviceDetection(): void {
    // Check for mobile (max-width: 1023px) OR touch screen (pointer: coarse)
    this.mobileQuery = window.matchMedia('(max-width: 1023px)');
    this.touchQuery = window.matchMedia('(pointer: coarse)');
    
    const updateDeviceState = () => {
      const wasImageDevice = this.shouldShowImageDevice;
      this.shouldShowImageDevice = this.mobileQuery!.matches || this.touchQuery!.matches;
      if (wasImageDevice !== this.shouldShowImageDevice) {
        this.updateVisualStates();
      }
    };

    this.shouldShowImageDevice = this.mobileQuery.matches || this.touchQuery.matches;

    this.mobileQueryHandler = () => updateDeviceState();
    this.touchQueryHandler = () => updateDeviceState();

    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.mobileQueryHandler as EventListener);
      this.touchQuery.addEventListener('change', this.touchQueryHandler as EventListener);
    } else if (this.mobileQuery.addListener) {
      this.mobileQuery.addListener(this.mobileQueryHandler);
      this.touchQuery.addListener(this.touchQueryHandler);
    }
  }

  private updateVisualStates(): void {
    this.services().forEach(service => {
      this.showVisuals[service.id] = false;
      if (!this.shouldShowImageDevice) {
        setTimeout(() => {
          if (!this.shouldShowImageDevice) this.showVisuals[service.id] = true;
        }, 500);
      }
    });
  }

  shouldShowImage(serviceId: string): boolean {
    return this.shouldShowImageDevice || !this.showVisuals[serviceId];
  }

  shouldShowVisual(serviceId: string): boolean {
    return !this.shouldShowImageDevice && this.showVisuals[serviceId];
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    
    const removeListener = (mq: MediaQueryList, handler: (e: MediaQueryListEvent | MediaQueryList) => void) => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler as EventListener);
      } else if (mq.removeListener) {
        mq.removeListener(handler);
      }
    };

    if (this.mobileQuery && this.mobileQueryHandler) {
      removeListener(this.mobileQuery, this.mobileQueryHandler);
    }
    if (this.touchQuery && this.touchQueryHandler) {
      removeListener(this.touchQuery, this.touchQueryHandler);
    }
  }
}
