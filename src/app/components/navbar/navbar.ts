import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
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
}
