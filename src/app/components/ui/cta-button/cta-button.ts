import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-button',
  imports: [CommonModule, RouterLink],
  templateUrl: './cta-button.html',
  styleUrl: './cta-button.scss'
})
export class CtaButtonComponent {
  @Input() size: 'small' | 'default' = 'default';
  @Input() href: string = '/contact';
  @Input() text: string = "Let's Talk";
  @Input() routerLink?: string;
  @Output() clicked = new EventEmitter<void>();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onClick(event: Event): void {
    this.clicked.emit();

    // Handle smooth scrolling for hash links
    const linkToCheck = this.routerLink || this.href;
    
    if (linkToCheck && linkToCheck.includes('#')) {
      // Extract section ID and scroll
      event.preventDefault();
      event.stopPropagation();
      const hashMatch = linkToCheck.match(/#(.+)/);
      if (hashMatch) {
        const sectionId = hashMatch[1];
        this.scrollToSection(sectionId);
      }
    } else if (this.routerLink) {
      // Use programmatic navigation for faster routing
      event.preventDefault();
      event.stopPropagation();
      this.router.navigateByUrl(this.routerLink).catch(err => {
        console.error('Navigation error:', err);
      });
    }
    // For regular href links, let browser handle it naturally
  }

  private scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;

    const currentUrl = this.router.url;
    
    if (currentUrl === '/' || currentUrl === '') {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500);
      });
    }
  }
}

