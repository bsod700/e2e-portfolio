import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-accessibility-statement-page',
  imports: [
    NavbarComponent
  ],
  templateUrl: './accessibility-statement-page.html',
  styleUrl: './accessibility-statement-page.scss'
})
export class AccessibilityStatementPageComponent {
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

