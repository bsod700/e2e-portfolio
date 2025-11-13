import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-terms-conditions-page',
  imports: [
    NavbarComponent
  ],
  templateUrl: './terms-conditions-page.html',
  styleUrl: './terms-conditions-page.scss'
})
export class TermsConditionsPageComponent {
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

