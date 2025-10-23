import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero';
import { AboutComponent } from '../../components/about/about';
import { ServicesComponent } from '../../components/services/services';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { CaseStudiesComponent } from '../../components/case-studies/case-studies';
import { TechnologiesComponent } from '../../components/technologies/technologies';
import { FaqComponent } from '../../components/faq/faq';
import { ContactComponent } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    TestimonialsComponent,
    CaseStudiesComponent,
    TechnologiesComponent,
    FaqComponent,
    ContactComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
}

