import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [
    NavbarComponent
  ],
  templateUrl: './privacy-policy-page.html',
  styleUrl: './privacy-policy-page.scss'
})
export class PrivacyPolicyPageComponent {
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

