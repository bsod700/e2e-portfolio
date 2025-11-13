import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-sitemap-page',
  imports: [
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './sitemap-page.html',
  styleUrl: './sitemap-page.scss'
})
export class SitemapPageComponent {
  currentYear = new Date().getFullYear();
}

