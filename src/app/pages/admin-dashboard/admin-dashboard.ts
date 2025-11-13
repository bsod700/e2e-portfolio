import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContentService, HomePageContent, ProjectContent, TestimonialContent, FAQContent, LegalPageContent, HomeServiceCard } from '../../services/content.service';
import { PageSidebarComponent, PageType, Page } from './components/page-sidebar/page-sidebar';
import { TabsNavigationComponent, TabType } from './components/tabs-navigation/tabs-navigation';
import { PasswordManagementComponent } from './components/password-management/password-management';
import { HeroEditorComponent } from './components/hero-editor/hero-editor';
import { ServicesEditorComponent } from './components/services-editor/services-editor';
import { ProjectsEditorComponent } from './components/projects-editor/projects-editor';
import { TestimonialsEditorComponent } from './components/testimonials-editor/testimonials-editor';
import { FAQEditorComponent } from './components/faq-editor/faq-editor';
import { LegalPageEditorComponent } from './components/legal-page-editor/legal-page-editor';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    PageSidebarComponent,
    TabsNavigationComponent,
    PasswordManagementComponent,
    HeroEditorComponent,
    ServicesEditorComponent,
    ProjectsEditorComponent,
    TestimonialsEditorComponent,
    FAQEditorComponent,
    LegalPageEditorComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private contentService = inject(ContentService);
  private router = inject(Router);

  // Page and tab management
  pages: Page[] = [
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

  loading = false;
  showPasswordSection = false;

  ngOnInit(): void {
    this.checkAuth();
    this.loadAllContent();
  }

  private async checkAuth(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.authService.isAllowedEmail(user.email || '')) {
      this.router.navigate(['/admin/login']);
    }
  }

  private loadAllContent(): void {
    this.loading = true;
    
    // Load Hero content
    this.contentService.getHomePageContent().subscribe({
      next: (data) => {
        if (data) {
          this.content = data;
        } else {
          this.content = {
            badge_text: 'From Vision to Infrastructure',
            hero_title: 'End-to-End\nDigital Solutions',
            hero_description: 'I design and build intuitive apps and websites, combining UX, development and AI into seamless user experiences.'
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hero content:', error);
        this.loading = false;
      }
    });

    // Load Home Page Services Section
    this.contentService.getHomeServicesSection().subscribe({
      next: (data) => {
        this.homeServices = data;
      },
      error: (error) => {
        console.error('Error loading home services section:', error);
      }
    });

    // Load Projects
    this.contentService.getProjectsContent().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });

    // Load Testimonials
    this.contentService.getTestimonialsContent().subscribe({
      next: (data) => {
        this.testimonials = data;
      },
      error: (error) => {
        console.error('Error loading testimonials:', error);
      }
    });

    // Load FAQs
    this.contentService.getFAQContent().subscribe({
      next: (data) => {
        this.faqs = data;
      },
      error: (error) => {
        console.error('Error loading FAQs:', error);
      }
    });

    // Load Legal Pages
    this.contentService.getLegalPageContent('accessibility-statement').subscribe({
      next: (data) => {
        this.accessibilityContent = data;
      },
      error: (error) => {
        console.error('Error loading accessibility content:', error);
      }
    });

    this.contentService.getLegalPageContent('privacy-policy').subscribe({
      next: (data) => {
        this.privacyContent = data;
      },
      error: (error) => {
        console.error('Error loading privacy content:', error);
      }
    });

    this.contentService.getLegalPageContent('terms-conditions').subscribe({
      next: (data) => {
        this.termsContent = data;
      },
      error: (error) => {
        console.error('Error loading terms content:', error);
      }
    });
  }

  setActivePage(page: PageType): void {
    this.activePage = page;
    const pageData = this.pages.find(p => p.id === page);
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
          console.error('Error reloading legal content:', error);
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
}
