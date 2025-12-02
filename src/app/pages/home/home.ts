import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HeroComponent,
  ServicesComponent,
  TestimonialsComponent,
  CaseStudiesComponent,
  TechnologiesComponent,
  FaqComponent,
  ContactComponent
} from '../../components/sections';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    ServicesComponent,
    TestimonialsComponent,
    CaseStudiesComponent,
    TechnologiesComponent,
    FaqComponent,
    ContactComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
}

