import { Component } from '@angular/core';
import { ProjectInquiryComponent } from '../project-inquiry/project-inquiry';

@Component({
  selector: 'app-hero',
  imports: [ProjectInquiryComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
}
