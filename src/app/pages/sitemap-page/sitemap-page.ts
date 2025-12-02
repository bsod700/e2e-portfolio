import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/layout';

@Component({
  selector: 'app-sitemap-page',
  imports: [
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './sitemap-page.html',
  styleUrl: './sitemap-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitemapPageComponent {
  currentYear = new Date().getFullYear();
}

