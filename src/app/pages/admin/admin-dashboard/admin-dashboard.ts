import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ContentService, HomePageContent, ProjectContent, TestimonialContent, FAQContent, LegalPageContent, HomeServiceCard } from '../../../services/content.service';
import { MainNavigationComponent, MainSection } from './components/main-navigation/main-navigation';
import { UserManagementComponent } from './components/user-management/user-management';
import { PageSidebarComponent, PageType, Page } from './components/page-sidebar/page-sidebar';
import { TabsNavigationComponent, TabType } from './components/tabs-navigation/tabs-navigation';
import { PasswordManagementComponent } from './components/password-management/password-management';
import { HeroEditorComponent } from './components/hero-editor/hero-editor';
import { ServicesEditorComponent } from './components/services-editor/services-editor';
import { ProjectsEditorComponent } from './components/projects-editor/projects-editor';
import { TestimonialsEditorComponent } from './components/testimonials-editor/testimonials-editor';
import { FAQEditorComponent } from './components/faq-editor/faq-editor';
import { LegalPageEditorComponent } from './components/legal-page-editor/legal-page-editor';
import { EmailDomainsEditorComponent } from './components/email-domains-editor/email-domains-editor';
import { ConfirmDialogComponent } from '../../../components/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    MainNavigationComponent,
    UserManagementComponent,
    PageSidebarComponent,
    TabsNavigationComponent,
    PasswordManagementComponent,
    HeroEditorComponent,
    ServicesEditorComponent,
    ProjectsEditorComponent,
    TestimonialsEditorComponent,
    FAQEditorComponent,
    LegalPageEditorComponent,
    EmailDomainsEditorComponent,
    ConfirmDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  // Main navigation
  readonly activeSection = signal<MainSection>('content');

  // Page and tab management (for Content section)
  readonly pages: Page[] = [
    { id: 'home', name: 'Home', tabs: ['hero', 'services', 'projects', 'testimonials', 'faq'] as TabType[] },
    { id: 'accessibility-statement', name: 'Accessibility Statement', tabs: [] },
    { id: 'privacy-policy', name: 'Privacy Policy', tabs: [] },
    { id: 'terms-conditions', name: 'Terms & Conditions', tabs: [] }
  ];
  activePage: PageType = 'home';
  activeTab: TabType = 'hero';
  
  get currentPage(): Page {
    return this.pages.find(p => p.id === this.activePage) || this.pages[0];
  }
  
  get currentTabs(): TabType[] {
    return this.currentPage.tabs as TabType[];
  }

  // Content data
  content: HomePageContent = {
    badge_text: '',
    hero_title: '',
    hero_description: ''
  };
  homeServices: HomeServiceCard[] = [];
  projects: ProjectContent[] = [];
  testimonials: TestimonialContent[] = [];
  faqs: FAQContent[] = [];
  accessibilityContent: LegalPageContent | null = null;
  privacyContent: LegalPageContent | null = null;
  termsContent: LegalPageContent | null = null;

  readonly loading = signal(false);

  onSectionChange(section: MainSection): void {
    this.activeSection.set(section);
  }

  ngOnInit(): void {
    this.checkAuth();
    this.loadAllContent();
  }

  private checkAuth(): void {
    // Use the isAuthenticated signal which already includes authorization check
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
    }
  }

  private loadAllContent(): void {
    this.loading.set(true);

    this.loadHeroContent();
    this.loadHomeServicesSection();
    this.loadProjects();
    this.loadTestimonials();
    this.loadFaqs();
    this.loadLegalPages();
  }

  setActivePage(page: PageType): void {
    this.activePage = page;
    const pageData = this.findPageById(page);
    if (pageData && pageData.tabs.length > 0) {
      this.activeTab = pageData.tabs[0] as TabType;
    }
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  onHeroContentSaved(content: HomePageContent): void {
    this.content = content;
  }

  onServicesUpdated(services: HomeServiceCard[]): void {
    this.homeServices = services;
  }

  onProjectsUpdated(projects: ProjectContent[]): void {
    this.projects = projects;
  }

  onTestimonialsUpdated(testimonials: TestimonialContent[]): void {
    this.testimonials = testimonials;
  }

  onFAQsUpdated(faqs: FAQContent[]): void {
    this.faqs = faqs;
  }

  onLegalContentUpdated(pageType: PageType, content: LegalPageContent): void {
    switch (pageType) {
      case 'accessibility-statement':
        this.accessibilityContent = content;
        break;
      case 'privacy-policy':
        this.privacyContent = content;
        break;
      case 'terms-conditions':
        this.termsContent = content;
        break;
    }
  }

  getCurrentLegalContent(): LegalPageContent | null {
    switch (this.activePage) {
      case 'accessibility-statement':
        return this.accessibilityContent;
      case 'privacy-policy':
        return this.privacyContent;
      case 'terms-conditions':
        return this.termsContent;
      default:
        return null;
    }
  }

  onContentSaved(message: string): void {
    // Reload the current legal page content after save
    if (this.activePage === 'accessibility-statement' || this.activePage === 'privacy-policy' || this.activePage === 'terms-conditions') {
      this.contentService.getLegalPageContent(this.activePage).subscribe({
        next: (data) => {
          switch (this.activePage) {
            case 'accessibility-statement':
              this.accessibilityContent = data;
              break;
            case 'privacy-policy':
              this.privacyContent = data;
              break;
            case 'terms-conditions':
              this.termsContent = data;
              break;
          }
        },
        error: (error) => {
          this.logError('Error reloading legal content', error);
        }
      });
    }
  }

  onContentError(message: string): void {
    console.error('Content error:', message);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  private loadHeroContent(): void {
    this.contentService.getHomePageContent().subscribe({
      next: (data) => {
        this.content = data ?? {
          badge_text: 'From Vision to Infrastructure',
          hero_title: 'End-to-End\nDigital Solutions',
          hero_description: 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.'
        };
        this.loading.set(false);
      },
      error: (error) => {
        this.logError('Error loading hero content', error);
        this.loading.set(false);
      }
    });
  }

  private loadHomeServicesSection(): void {
    this.contentService.getHomeServicesSection().subscribe({
      next: (data) => {
        this.homeServices = data;
      },
      error: (error) => {
        this.logError('Error loading home services section', error);
      }
    });
  }

  private loadProjects(): void {
    this.contentService.getProjectsContent().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        this.logError('Error loading projects', error);
      }
    });
  }

  private loadTestimonials(): void {
    this.contentService.getTestimonialsContent().subscribe({
      next: (data) => {
        this.testimonials = data;
      },
      error: (error) => {
        this.logError('Error loading testimonials', error);
      }
    });
  }

  private loadFaqs(): void {
    this.contentService.getFAQContent().subscribe({
      next: (data) => {
        this.faqs = data;
      },
      error: (error) => {
        this.logError('Error loading FAQs', error);
      }
    });
  }

  private loadLegalPages(): void {
    this.contentService.getLegalPageContent('accessibility-statement').subscribe({
      next: (data) => {
        this.accessibilityContent = data;
      },
      error: (error) => {
        this.logError('Error loading accessibility content', error);
      }
    });

    this.contentService.getLegalPageContent('privacy-policy').subscribe({
      next: (data) => {
        this.privacyContent = data;
      },
      error: (error) => {
        this.logError('Error loading privacy content', error);
      }
    });

    this.contentService.getLegalPageContent('terms-conditions').subscribe({
      next: (data) => {
        this.termsContent = data;
      },
      error: (error) => {
        this.logError('Error loading terms content', error);
      }
    });
  }

  private findPageById(id: PageType): Page | undefined {
    return this.pages.find((page) => page.id === id);
  }

  private logError(context: string, error: unknown): void {
    console.error(context, error);
  }
}
