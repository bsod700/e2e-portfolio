import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollToTopComponent } from '../../ui';

@Component({
  selector: 'app-footer',
  imports: [ScrollToTopComponent, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
