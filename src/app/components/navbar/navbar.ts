import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CtaButtonComponent } from '../cta-button/cta-button';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, CtaButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (this.isBrowser) {
      this.closeMenu();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.isBrowser) {
      document.body.classList.toggle('no-scroll', this.menuOpen);
    }
  }

  closeMenu() {
    this.menuOpen = false;
    if (this.isBrowser) {
      document.body.classList.remove('no-scroll');
    }
  }

  scrollToTop(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!this.isBrowser) return;

    const currentUrl = this.router.url;
    
    if (currentUrl === '/' || currentUrl === '') {
      // Already on home page, just scroll
      this.closeMenu();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home first, then scroll
      this.closeMenu();
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      });
    }
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!this.isBrowser) return;

    const currentUrl = this.router.url;
    
    if (currentUrl === '/' || currentUrl === '') {
      // Already on home page, just scroll to section
      this.closeMenu();
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Account for fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Navigate to home first, then scroll to section
      this.closeMenu();
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offset = 80; // Account for fixed navbar
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
