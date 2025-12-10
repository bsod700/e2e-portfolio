import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sitemap-page',
  imports: [
    RouterLink
  ],
  templateUrl: './sitemap-page.html',
  styleUrl: './sitemap-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitemapPageComponent {
  currentYear = new Date().getFullYear();
}

